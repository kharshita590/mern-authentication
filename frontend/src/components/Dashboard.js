import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const COURSES = [
  'Computer Science', 'Information Technology', 'Electronics & Communication',
  'Mechanical Engineering', 'Civil Engineering', 'Data Science',
  'Artificial Intelligence', 'Business Administration', 'Other'
];

function Dashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  // Password update state
  const [pwData, setPwData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwMsg, setPwMsg] = useState({ text: '', type: '' });
  const [pwLoading, setPwLoading] = useState(false);

  // Course update state
  const [newCourse, setNewCourse] = useState('');
  const [courseMsg, setCourseMsg] = useState({ text: '', type: '' });
  const [courseLoading, setCourseLoading] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const { data } = await API.get('/me');
        setStudent(data.student);
        setNewCourse(data.student.course);
      } catch {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('student');
    navigate('/login');
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (pwData.newPassword !== pwData.confirmPassword) {
      return setPwMsg({ text: 'New passwords do not match.', type: 'danger' });
    }
    setPwLoading(true);
    setPwMsg({ text: '', type: '' });
    try {
      const { data } = await API.put('/update-password', {
        oldPassword: pwData.oldPassword,
        newPassword: pwData.newPassword
      });
      setPwMsg({ text: data.message, type: 'success' });
      setPwData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwMsg({ text: err.response?.data?.message || 'Update failed.', type: 'danger' });
    } finally {
      setPwLoading(false);
    }
  };

  const handleCourseUpdate = async (e) => {
    e.preventDefault();
    setCourseLoading(true);
    setCourseMsg({ text: '', type: '' });
    try {
      const { data } = await API.put('/update-course', { course: newCourse });
      setStudent(data.student);
      setCourseMsg({ text: data.message, type: 'success' });
    } catch (err) {
      setCourseMsg({ text: err.response?.data?.message || 'Update failed.', type: 'danger' });
    } finally {
      setCourseLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-large"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      {/* Navbar */}
      <nav className="dashboard-nav">
        <div className="nav-brand">🎓 Student Portal</div>
        <div className="nav-right">
          <span className="nav-user">👋 {student?.name}</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        {/* Sidebar Tabs */}
        <aside className="sidebar">
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            📋 My Profile
          </button>
          <button
            className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            🔒 Change Password
          </button>
          <button
            className={`tab-btn ${activeTab === 'course' ? 'active' : ''}`}
            onClick={() => setActiveTab('course')}
          >
            📚 Change Course
          </button>
        </aside>

        {/* Main Panel */}
        <main className="main-panel">
          {activeTab === 'profile' && (
            <div className="panel-card">
              <h3>My Profile</h3>
              <div className="profile-grid">
                <div className="profile-item">
                  <span className="profile-label">Full Name</span>
                  <span className="profile-value">{student?.name}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Email</span>
                  <span className="profile-value">{student?.email}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Course</span>
                  <span className="profile-value">{student?.course}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Member Since</span>
                  <span className="profile-value">
                    {student?.createdAt
                      ? new Date(student.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })
                      : 'N/A'}
                  </span>
                </div>
              </div>
              <div className="welcome-banner">
                <p>🎉 Welcome to your student dashboard, <strong>{student?.name}</strong>!</p>
                <p>You are enrolled in <strong>{student?.course}</strong>.</p>
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="panel-card">
              <h3>Change Password</h3>
              {pwMsg.text && (
                <div className={`alert alert-${pwMsg.type}`}>{pwMsg.text}</div>
              )}
              <form onSubmit={handlePasswordUpdate}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter current password"
                    value={pwData.oldPassword}
                    onChange={(e) => setPwData({ ...pwData, oldPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Minimum 6 characters"
                    value={pwData.newPassword}
                    onChange={(e) => setPwData({ ...pwData, newPassword: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Re-enter new password"
                    value={pwData.confirmPassword}
                    onChange={(e) => setPwData({ ...pwData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary-custom" disabled={pwLoading}>
                  {pwLoading ? <span className="spinner"></span> : 'Update Password'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'course' && (
            <div className="panel-card">
              <h3>Change Course</h3>
              <p className="current-info">Current: <strong>{student?.course}</strong></p>
              {courseMsg.text && (
                <div className={`alert alert-${courseMsg.type}`}>{courseMsg.text}</div>
              )}
              <form onSubmit={handleCourseUpdate}>
                <div className="form-group">
                  <label>Select New Course</label>
                  <select
                    className="form-control"
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    required
                  >
                    {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <button type="submit" className="btn-primary-custom" disabled={courseLoading}>
                  {courseLoading ? <span className="spinner"></span> : 'Update Course'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
