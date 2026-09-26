'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const styles = {
  main: {
    minHeight: '100vh',
    padding: '2rem 1.25rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'system-ui, sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '480px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  title: {
    fontSize: '2rem',
    margin: 0,
    textAlign: 'center',
  },
  label: {
    display: 'block',
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '0.4rem',
  },
  input: {
    width: '100%',
    fontSize: '1.5rem',
    padding: '0.75rem',
    borderRadius: '10px',
    border: '2px solid #ccc',
    boxSizing: 'border-box',
  },
  button: {
    fontSize: '1.4rem',
    fontWeight: 700,
    padding: '1rem',
    borderRadius: '12px',
    border: 'none',
    background: '#111',
    color: '#fff',
    cursor: 'pointer',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  errorBox: {
    background: '#fee2e2',
    border: '2px solid #ef4444',
    color: '#991b1b',
    borderRadius: '10px',
    padding: '1rem',
    fontSize: '1.1rem',
    fontWeight: 600,
  },
  warningBox: {
    background: '#fff4e5',
    border: '3px solid #f97316',
    borderRadius: '14px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  warningTitle: {
    fontSize: '1.3rem',
    fontWeight: 800,
    color: '#c2410c',
    margin: 0,
  },
  warningButton: {
    fontSize: '1.2rem',
    fontWeight: 700,
    padding: '0.9rem',
    borderRadius: '10px',
    border: 'none',
    background: '#ef4444',
    color: '#fff',
    cursor: 'pointer',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.25rem',
    zIndex: 50,
  },
  confirmBox: {
    background: '#fff',
    border: '3px solid #ef4444',
    borderRadius: '16px',
    padding: '1.5rem',
    width: '100%',
    maxWidth: '420px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  confirmTitle: {
    fontSize: '1.4rem',
    fontWeight: 800,
    color: '#991b1b',
    margin: 0,
    textAlign: 'center',
  },
  confirmInfo: {
    fontSize: '1.15rem',
    lineHeight: 1.6,
    background: '#fef2f2',
    borderRadius: '10px',
    padding: '0.9rem 1rem',
  },
  confirmActions: {
    display: 'flex',
    gap: '0.75rem',
  },
  cancelButton: {
    flex: 1,
    fontSize: '1.1rem',
    fontWeight: 700,
    padding: '0.9rem',
    borderRadius: '10px',
    border: '2px solid #ccc',
    background: '#fff',
    color: '#333',
    cursor: 'pointer',
  },
  confirmCloseButton: {
    flex: 1,
    fontSize: '1.1rem',
    fontWeight: 700,
    padding: '0.9rem',
    borderRadius: '10px',
    border: 'none',
    background: '#dc2626',
    color: '#fff',
    cursor: 'pointer',
  },
  resultBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    background: '#f0fdf4',
    border: '3px solid #22c55e',
    borderRadius: '16px',
    padding: '1.5rem',
  },
  qrImage: {
    width: '260px',
    height: '260px',
    maxWidth: '100%',
  },
  summaryText: {
    fontSize: '1.3rem',
    fontWeight: 700,
    margin: 0,
  },
  linkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    width: '100%',
    background: '#fff',
    border: '2px solid #d1d5db',
    borderRadius: '10px',
    padding: '0.5rem 0.5rem 0.5rem 0.9rem',
  },
  linkText: {
    flex: 1,
    fontSize: '1rem',
    wordBreak: 'break-all',
    color: '#111',
  },
  copyButton: {
    fontSize: '0.95rem',
    fontWeight: 700,
    padding: '0.5rem 0.8rem',
    borderRadius: '8px',
    border: 'none',
    background: '#111',
    color: '#fff',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  newTableButton: {
    fontSize: '1.2rem',
    fontWeight: 700,
    padding: '0.9rem 1.5rem',
    borderRadius: '10px',
    border: 'none',
    background: '#111',
    color: '#fff',
    cursor: 'pointer',
  },
};

function minutesSince(createdAt) {
  const createdMs = new Date(createdAt).getTime();
  const diffMs = Date.now() - createdMs;
  return Math.max(0, Math.floor(diffMs / 60000));
}

export default function GenerateQrPage() {
  const [tableNumber, setTableNumber] = useState('');
  const [adultCount, setAdultCount] = useState('');
  const [childCount, setChildCount] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // session ที่เปิดค้างอยู่แล้ว (ถ้ามี)
  const [existingSession, setExistingSession] = useState(null);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [closingLoading, setClosingLoading] = useState(false);

  // ผลลัพธ์หลังเปิดโต๊ะสำเร็จ
  const [qrResult, setQrResult] = useState(null);
  const [copied, setCopied] = useState(false);

  function resetToBlankForm() {
    setTableNumber('');
    setAdultCount('');
    setChildCount('');
    setQrResult(null);
    setExistingSession(null);
    setShowConfirmClose(false);
    setErrorMsg('');
  }

  async function handleOpenTable(e) {
    e.preventDefault();
    setErrorMsg('');

    const tableNum = Number(tableNumber);
    const adults = Number(adultCount);
    const children = Number(childCount);

    if (!tableNumber || Number.isNaN(tableNum) || tableNum <= 0) {
      setErrorMsg('กรุณากรอกเลขโต๊ะให้ถูกต้อง');
      return;
    }
    if (adultCount === '' || Number.isNaN(adults) || adults < 0) {
      setErrorMsg('กรุณากรอกจำนวนผู้ใหญ่ให้ถูกต้อง');
      return;
    }
    if (childCount === '' || Number.isNaN(children) || children < 0) {
      setErrorMsg('กรุณากรอกจำนวนเด็กให้ถูกต้อง');
      return;
    }

    setLoading(true);
    try {
      // 1) เช็คว่ามี session ที่ยังเปิดอยู่ของโต๊ะนี้หรือไม่
      const { data: openSessions, error: checkError } = await supabase
        .from('sessions')
        .select('id, table_number, adult_count, child_count, created_at')
        .eq('table_number', tableNum)
        .eq('status', 'open')
        .limit(1);

      if (checkError) throw checkError;

      if (openSessions && openSessions.length > 0) {
        // มี session เปิดค้างอยู่ -> แสดงกล่องเตือนแทนการสร้างใหม่
        setExistingSession(openSessions[0]);
        setLoading(false);
        return;
      }

      // 2) ไม่มี session เปิดค้าง -> สร้างใหม่
      const { data: inserted, error: insertError } = await supabase
        .from('sessions')
        .insert({
          table_number: tableNum,
          adult_count: adults,
          child_count: children,
          status: 'open',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const orderUrl = `${window.location.origin}/order/${inserted.table_number}`;
      setQrResult({
        tableNumber: inserted.table_number,
        adultCount: inserted.adult_count,
        childCount: inserted.child_count,
        url: orderUrl,
      });
    } catch (err) {
      setErrorMsg('เกิดข้อผิดพลาด: ' + (err?.message || 'ไม่สามารถเปิดโต๊ะได้'));
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmCloseOld() {
    if (!existingSession) return;
    setClosingLoading(true);
    setErrorMsg('');

    try {
      // เช็คซ้ำว่า status ยังเป็น 'open' ตอน update เพื่อกันการกดซ้ำซ้อน
      const { data: updated, error: updateError } = await supabase
        .from('sessions')
        .update({ status: 'closed' })
        .eq('id', existingSession.id)
        .eq('status', 'open')
        .select();

      if (updateError) throw updateError;

      if (!updated || updated.length === 0) {
        // มีคนอื่นปิดไปแล้วก่อนหน้านี้
        setErrorMsg('โต๊ะนี้ถูกปิดออเดอร์ไปแล้ว กรุณากดเปิดโต๊ะอีกครั้ง');
        setShowConfirmClose(false);
        setExistingSession(null);
        return;
      }

      // ปิดสำเร็จ -> เอากล่องเตือน/กล่องยืนยันออก กลับไปที่ฟอร์มเดิม (ค่ากรอกไว้ยังอยู่)
      setShowConfirmClose(false);
      setExistingSession(null);
    } catch (err) {
      setErrorMsg('เกิดข้อผิดพลาด: ' + (err?.message || 'ไม่สามารถปิดโต๊ะเดิมได้'));
    } finally {
      setClosingLoading(false);
    }
  }

  async function handleCopyLink() {
    if (!qrResult) return;
    try {
      await navigator.clipboard.writeText(qrResult.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setErrorMsg('คัดลอกลิงก์ไม่สำเร็จ กรุณาคัดลอกด้วยตัวเอง');
    }
  }

  // ---------- หน้าผลลัพธ์ QR ----------
  if (qrResult) {
    const qrImageUrl =
      'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' +
      encodeURIComponent(qrResult.url);

    return (
      <main style={styles.main}>
        <div style={styles.card}>
          <h1 style={styles.title}>chacha · เปิดโต๊ะสำเร็จ</h1>

          <div style={styles.resultBox}>
            <img src={qrImageUrl} alt={`QR โต๊ะ ${qrResult.tableNumber}`} style={styles.qrImage} />

            <p style={styles.summaryText}>
              โต๊ะ {qrResult.tableNumber} · ผู้ใหญ่ {qrResult.adultCount} · เด็ก {qrResult.childCount}
            </p>

            <div style={styles.linkRow}>
              <span style={styles.linkText}>{qrResult.url}</span>
              <button type="button" style={styles.copyButton} onClick={handleCopyLink}>
                {copied ? 'คัดลอกแล้ว ✓' : 'คัดลอกลิงก์'}
              </button>
            </div>
          </div>

          {errorMsg && <div style={styles.errorBox}>{errorMsg}</div>}

          <button type="button" style={styles.newTableButton} onClick={resetToBlankForm}>
            เปิดโต๊ะใหม่
          </button>
        </div>
      </main>
    );
  }

  // ---------- หน้าฟอร์มปกติ (+ กล่องเตือน / กล่องยืนยัน) ----------
  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <h1 style={styles.title}>chacha · เปิดโต๊ะ</h1>

        {existingSession && (
          <div style={styles.warningBox}>
            <p style={styles.warningTitle}>
              โต๊ะนี้มีลูกค้าอยู่ระหว่างทานอาหาร กรุณาปิดออเดอร์เดิมก่อน
            </p>
            <button
              type="button"
              style={styles.warningButton}
              onClick={() => setShowConfirmClose(true)}
            >
              ปิดออเดอร์เดิม
            </button>
          </div>
        )}

        {errorMsg && <div style={styles.errorBox}>{errorMsg}</div>}

        <form onSubmit={handleOpenTable} style={styles.card}>
          <div>
            <label style={styles.label} htmlFor="tableNumber">
              เลขโต๊ะ
            </label>
            <input
              id="tableNumber"
              type="number"
              inputMode="numeric"
              min="1"
              style={styles.input}
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="เช่น 7"
            />
          </div>

          <div>
            <label style={styles.label} htmlFor="adultCount">
              จำนวนผู้ใหญ่
            </label>
            <input
              id="adultCount"
              type="number"
              inputMode="numeric"
              min="0"
              style={styles.input}
              value={adultCount}
              onChange={(e) => setAdultCount(e.target.value)}
              placeholder="เช่น 2"
            />
          </div>

          <div>
            <label style={styles.label} htmlFor="childCount">
              จำนวนเด็ก
            </label>
            <input
              id="childCount"
              type="number"
              inputMode="numeric"
              min="0"
              style={styles.input}
              value={childCount}
              onChange={(e) => setChildCount(e.target.value)}
              placeholder="เช่น 0"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
          >
            {loading ? 'กำลังเปิดโต๊ะ...' : 'เปิดโต๊ะ'}
          </button>
        </form>
      </div>

      {showConfirmClose && existingSession && (
        <div style={styles.overlay}>
          <div style={styles.confirmBox}>
            <h2 style={styles.confirmTitle}>ยืนยันปิดโต๊ะเดิม?</h2>
            <div style={styles.confirmInfo}>
              โต๊ะ {existingSession.table_number}
              <br />
              ผู้ใหญ่ {existingSession.adult_count} · เด็ก {existingSession.child_count}
              <br />
              เปิดมาแล้ว {minutesSince(existingSession.created_at)} นาที
            </div>
            <div style={styles.confirmActions}>
              <button
                type="button"
                style={styles.cancelButton}
                onClick={() => setShowConfirmClose(false)}
                disabled={closingLoading}
              >
                ยกเลิก
              </button>
              <button
                type="button"
                style={styles.confirmCloseButton}
                onClick={handleConfirmCloseOld}
                disabled={closingLoading}
              >
                {closingLoading ? 'กำลังปิด...' : 'ยืนยันปิดโต๊ะเดิม'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
