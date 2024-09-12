import { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import AddProduct from '../pages/AddProduct';
import EditProduct from './EditProduct';
import ArchiveProduct from './ArchiveProduct'; // Import ArchiveCourse

export default function AdminView({ coursesData, fetchData }) {
    const [courses, setCourses] = useState([]);
    const [showAddCourse, setShowAddCourse] = useState(false);

    // Toggle AddCourse form
    const toggleAddCourse = () => setShowAddCourse(!showAddCourse);

    // Update course status
    const updateCourseStatus = (courseId, isActive) => {
        setCourses(prevCourses =>
            prevCourses.map(course =>
                course._id === courseId ? { ...course, isActive } : course
            )
        );
    };

    // Getting the coursesData from the courses page
    useEffect(() => {
        console.log(coursesData);

        const coursesArr = coursesData.map((course) => (
            <tr key={course._id}>
                <td>{course.name}</td>
                <td>{course.description}</td>
                <td>{course.price}</td>
                <td className={course.isActive ? "text-success" : "text-danger"}>
                    {course.isActive ? "Available" : "Unavailable"}
                </td>
                <td className="text-center">
                    <EditCourse course={course} fetchData={fetchData} />
                    <ArchiveCourse
                        course={course}
                        isActive={course.isActive}
                        fetchData={fetchData}
                        updateCourseStatus={updateCourseStatus} // Pass update function
                    />
                </td>
            </tr>
        ));

        setCourses(coursesArr);
    }, [coursesData]);

    return (
        <>
            <h1 className="text-center my-4">Admin Dashboard</h1>

            {/* Add New Product and Show User Orders Buttons */}
            <div className="text-center my-3">
                <Button variant="primary" onClick={toggleAddCourse}>Add New Product</Button>{' '}
                <Button variant="success">Show User Orders</Button>
            </div>

            {/* Conditionally render AddCourse form */}
            {showAddCourse && <AddCourse />}

            <Table striped bordered hover responsive>
                <thead>
                    <tr className="text-center">
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Availability</th>
                        <th colSpan="2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.length > 0 ? courses : <tr><td colSpan="5" className="text-center">No Courses Available</td></tr>}
                </tbody>
            </Table>
        </>
    );
}
