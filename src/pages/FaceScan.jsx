import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';
import { subjectCatalog } from '../data/mockData';
import './FaceScan.css';

const MODEL_URL = '/models';

export default function FaceScan() {
  const { currentUser } = useAuth();
  const { records, markAttendance } = useAttendance();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const detectionLoopRef = useRef(null);
  const cameraRequestRef = useRef(false);
  const detectStartRef = useRef(0);
  const attendanceCompleteRef = useRef(false);
  const [status, setStatus] = useState('Requesting camera permission...');
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [cameraErrorName, setCameraErrorName] = useState('');
  const [identity, setIdentity] = useState(null);
  const [subject, setSubject] = useState(subjectCatalog[0]);
  const [markedMessage, setMarkedMessage] = useState('');
  const [modelReady, setModelReady] = useState(false);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const requestCameraAccess = async (attempt = 0) => {
    setCameraError('');
    setCameraErrorName('');
    setMarkedMessage('');
    setStatus('Requesting camera permission...');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser.');
      }

      stopCameraStream();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        videoRef.current.autoplay = true;
        await videoRef.current.play();
      }

      setStatus('Loading face detector...');
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);

      setCameraReady(true);
      setModelReady(true);
      setCameraError('');
      setCameraErrorName('');
      setStatus('Scanning...');
    } catch (error) {
      console.error('Camera and face model initialization failed:', error);

      const browserErrorName = error && error.name ? error.name : 'UnknownError';
      const browserErrorMessage = error && error.message ? error.message : 'Unknown camera error.';
      const retryable = ['AbortError', 'NotReadableError', 'OverconstrainedError'];

      if (retryable.includes(browserErrorName) && attempt < 3) {
        setStatus(`Camera busy or blocked (${browserErrorName}). Retrying... (${attempt + 1}/3)`);
        await new Promise((resolve) => window.setTimeout(resolve, 500));
        stopCameraStream();
        return requestCameraAccess(attempt + 1);
      }

      stopCameraStream();
      setCameraReady(false);
      setCameraErrorName(browserErrorName);
      setCameraError(`Camera access failed: ${browserErrorMessage}`);
      setStatus(`Camera access rejected (${browserErrorName}).`);

      try {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputs = devices.filter((device) => device.kind === 'videoinput');

          for (const device of videoInputs) {
            try {
              const replacementStream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: device.deviceId } },
                audio: false,
              });

              streamRef.current = replacementStream;
              if (videoRef.current) {
                videoRef.current.srcObject = replacementStream;
                videoRef.current.muted = true;
                videoRef.current.playsInline = true;
                videoRef.current.autoplay = true;
                await videoRef.current.play();
              }

              setCameraReady(true);
              setCameraError('');
              setCameraErrorName('');
              setStatus('Scanning...');
              return;
            } catch (deviceError) {
              console.error(`Camera device fallback failed for ${device.label || device.deviceId}:`, deviceError);
            }
          }
        }
      } catch (enumerationError) {
        console.error('Device enumeration failed:', enumerationError);
      }
    }
  };

  const markAttendanceManually = () => {
    const studentId = currentUser?.studentId || currentUser?.id || 'STU-1001';
    const studentName = currentUser?.name || 'Student';
    const duplicate = records.some(
      (record) => record.studentId === studentId && record.subject === subject && record.date === new Date().toISOString().split('T')[0],
    );

    if (duplicate) {
      setMarkedMessage('Attendance already marked today');
      setStatus('Attendance already marked today');
      return;
    }

    const record = markAttendance(studentId, subject, {
      method: 'Manual',
      status: 'present',
    });

    setIdentity({
      name: studentName,
      studentId,
      department: currentUser?.department || 'N/A',
      time: record.time,
    });
    setMarkedMessage('Attendance marked successfully');
    setCameraReady(false);
    setCameraError('');
    setCameraErrorName('');
    setStatus('Attendance marked successfully');
    stopCameraStream();
  };

  useEffect(() => {
    if (cameraRequestRef.current) return undefined;
    cameraRequestRef.current = true;

    requestCameraAccess();

    return () => {
      if (detectionLoopRef.current) {
        window.clearTimeout(detectionLoopRef.current);
      }
      stopCameraStream();
    };
  }, []);

  useEffect(() => {
    if (!cameraReady || !modelReady || !videoRef.current || attendanceCompleteRef.current) return undefined;

    let isMounted = true;

    const runDetection = async () => {
      if (!isMounted || attendanceCompleteRef.current) return;

      const video = videoRef.current;
      if (!video || video.readyState < 2) {
        detectionLoopRef.current = window.setTimeout(runDetection, 200);
        return;
      }

      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
      }

      try {
        const detection = await faceapi.detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }),
        );

        if (!detection) {
          clearCanvas();
          detectStartRef.current = 0;
          setStatus('Scanning...');
          detectionLoopRef.current = window.setTimeout(runDetection, 200);
          return;
        }

        const drawBox = new faceapi.draw.DrawBox(detection.box, {
          label: 'Face detected',
          boxColor: '#22c55e',
        });

        if (canvas) {
          const context = canvas.getContext('2d');
          if (context) {
            const displaySize = { width: video.videoWidth || 640, height: video.videoHeight || 480 };
            faceapi.matchDimensions(canvas, displaySize);
            drawBox.draw(canvas);
          }
        }

        if (detectStartRef.current === 0) {
          detectStartRef.current = Date.now();
        }

        const elapsed = Date.now() - detectStartRef.current;
        setStatus(elapsed >= 1000 ? 'Face detected' : 'Face detected');

        if (elapsed >= 1000) {
          const today = new Date().toISOString().split('T')[0];
          const studentId = currentUser?.studentId || currentUser?.id || 'STU-1001';
          const alreadyMarked = records.some(
            (record) => record.studentId === studentId && record.subject === subject && record.date === today,
          );

          if (alreadyMarked) {
            setMarkedMessage('Attendance already marked today');
            setStatus('Attendance already marked today');
            stopCameraStream();
            attendanceCompleteRef.current = true;
            setCameraReady(false);
            return;
          }

          const record = markAttendance(studentId, subject, {
            method: 'Face Recognition',
            status: 'present',
          });

          setIdentity({
            name: currentUser?.name || 'Student',
            studentId,
            department: currentUser?.department || 'N/A',
            time: record.time,
          });

          setMarkedMessage('Attendance marked successfully');
          setStatus('Attendance marked successfully');
          stopCameraStream();
          attendanceCompleteRef.current = true;
          setCameraReady(false);
          return;
        }
      } catch (error) {
        console.error('Face detection error:', error);
        clearCanvas();
      }

      detectionLoopRef.current = window.setTimeout(runDetection, 200);
    };

    runDetection();

    return () => {
      isMounted = false;
      if (detectionLoopRef.current) {
        window.clearTimeout(detectionLoopRef.current);
      }
    };
  }, [cameraReady, currentUser, markAttendance, modelReady, records, subject]);

  const currentTime = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="page-shell face-scan-page">
      <div className="section-header">
        <div>
          <p className="eyebrow">Smart attendance</p>
          <h1>Automatic Face Scan</h1>
        </div>
      </div>

      <div className="scan-card">
        <div className="subject-picker">
          <label htmlFor="subject">Select Subject</label>
          <select id="subject" value={subject} onChange={(event) => setSubject(event.target.value)}>
            {subjectCatalog.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="scanner-box active">
          <video ref={videoRef} className="camera-preview" autoPlay playsInline muted />
          <canvas ref={canvasRef} className="scan-canvas" />
          <div className="scanner-overlay" />
        </div>

        <div className="status-panel">
          <div className="status-title">{status}</div>
          {markedMessage && <div className="success-banner">{markedMessage}</div>}
          {cameraError && (
            <>
              <button type="button" className="login-btn" onClick={requestCameraAccess}>
                Try Again
              </button>
              <button type="button" className="secondary-btn" onClick={markAttendanceManually} style={{ marginTop: '0.75rem' }}>
                Mark Attendance Manually
              </button>
            </>
          )}
          {cameraError && <div className="error-box">{cameraError}</div>}
          {cameraErrorName && <div className="error-box">Error name: {cameraErrorName}</div>}
          {identity && (
            <div className="success-details">
              <span><strong>Student Name:</strong> {identity.name}</span>
              <span><strong>Student ID:</strong> {identity.studentId}</span>
              <span><strong>Department:</strong> {identity.department}</span>
              <span><strong>Time:</strong> {identity.time}</span>
              <span><strong>Status:</strong> PRESENT</span>
            </div>
          )}
        </div>

        <div className="timestamp-box">
          <span>Today</span>
          <strong>{currentTime}</strong>
        </div>
      </div>
    </div>
  );
}

