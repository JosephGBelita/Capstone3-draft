import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function ArchiveCourse({ course, isActive, fetchData }) {
  const notyf = new Notyf();
  const [courseId] = useState(course._id);

  const archiveToggle = () => {
    fetch(`${process.env.REACT_APP_API_URL}/courses/${courseId}/archive`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        notyf.success("Successfully Archived");
        fetchData(); // Ensure this refreshes data in AdminView
      } else {
        notyf.error("Something Went Wrong");
      }
    })
    .catch(error => {
      notyf.error("Network error");
      console.error('Error:', error);
    });
  };

  const activateToggle = () => {
    fetch(`${process.env.REACT_APP_API_URL}/courses/${courseId}/activate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        notyf.success("Successfully Activated");
        fetchData(); // Ensure this refreshes data in AdminView
      } else {
        notyf.error("Something Went Wrong");
      }
    })
    .catch(error => {
      notyf.error("Network error");
      console.error('Error:', error);
    });
  };

  return (
    <>
      {isActive ? (
        <Button variant="danger" size="sm" onClick={archiveToggle}>Archive</Button>
      ) : (
        <Button variant="success" size="sm" onClick={activateToggle}>Activate</Button>
      )}
    </>
  );
}
