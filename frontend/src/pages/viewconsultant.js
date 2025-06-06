import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ConsultancyProjectsPage = () => {
    const [consultancyProjects, setConsultancyProjects] = useState([]);
    const faculty_id = sessionStorage.getItem("faculty_id");
    const [visibleDetails, setVisibleDetails] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConsultancyProjects = async () => {
            try {
                const response = await fetch(`http://localhost:5000/getConsultancy/${faculty_id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch consultancy projects");
                }
                let data = await response.json();
                setConsultancyProjects(data);
            } catch (error) {
                console.error("Error fetching consultancy projects:", error);
            }
        };
        fetchConsultancyProjects();
    }, [faculty_id]);

    const handleToggleDetails = (consultancy_id) => {
        setVisibleDetails(visibleDetails === consultancy_id ? null : consultancy_id);
    };

    const handleEdit = (project) => {
        navigate('/editconsultancy', { state: { project } });
    };
    
    const handleDelete = async (consultancy_id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Consultancy?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:5000/deleteConsultancy/${consultancy_id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete consultancy');
            }

            setConsultancyProjects(consultancyProjects.filter(project => project.consultancy_id !== consultancy_id));
            alert("Consultancy deleted successfully!");
        } catch (error) {
            console.error('Error deleting consultancy:', error);
            alert("Failed to delete the consultancy.");
        }
    };

    return (
        <div className="container mt-2">
            <h2 className="text-center text-dark mb-4">Your Consultancy Projects</h2>
            {consultancyProjects.length > 0 ? (
                <div className="row">
                    {consultancyProjects.map(project => (
                        <div className="col-md-6 mb-4" key={project.consultancy_id}>
                            <div className="card">
                                <div className="card-body flex-column">
                                <div className='d-flex justify-content-between align-items-center mb-3'>
                                    <h5 className="card-title">
                                        <strong>Title: </strong>
                                        <a
                                            href="#!"
                                            onClick={() => handleToggleDetails(project.consultancy_id)}
                                            className="text-primary"
                                        >
                                            {project.titleofconsultancy}
                                        </a>
                                    </h5>
                                    <div className="d-flex gap-2">
                                    <button 
                                        className="btn btn-warning mt-2" 
                                        onClick={() => handleEdit(project)}
                                    >
                                        Edit
                                    </button>
                                        <button className="btn btn-danger mt-2" onClick={() => handleDelete(project.consultancy_id)}>
                                                Delete
                                            </button>
                                            </div>
                                    </div>
                                    {visibleDetails === project.consultancy_id && (
                                        <div className="overflow-auto" style={{ maxHeight: '250px' }}>
                                            <div className="card-details">
                                            {project.financialYear && <p><strong>Financial Year:</strong> {project.financialYear}</p>}
                                                {project.department && <p><strong>Department:</strong> {project.department}</p>}
                                                {project.startdateofProject && <p><strong>Start Date:</strong> {project.startdateofProject}</p>}
                                                {project.numoffaculty && <p><strong>Number of Faculty Involved:</strong> {project.numoffaculty}</p>}
                                                {project.domainofconsultancy && <p><strong>Domain:</strong> {project.domainofconsultancy}</p>}
                                                {project.clientorganization && <p><strong>Client Organization:</strong> {project.clientorganization}</p>}
                                                {project.clientaddress && <p><strong>Client Address:</strong> {project.clientaddress}</p>}
                                                {project.amountreceived && <p><strong>Amount Received:</strong> {project.amountreceived}</p>}
                                                {project.dateofamountreceived && <p><strong>Date of Amount Received:</strong> {project.dateofamountreceived}</p>}
                                                {project.facilities && <p><strong>Facilities Used:</strong> {project.facilities}</p>}
                                                
                                                {project.faculties && typeof project.faculties === "string" ? (
                                                                <div>
                                                                    <strong>Faculty Members Involved:</strong>
                                                                    <table className="table table-bordered mt-2">
                                                                        <thead className="thead-dark">
                                                                            <tr>
                                                                                <th>Name</th>
                                                                                <th>Designation</th>
                                                                                <th>Mail ID</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {JSON.parse(project.faculties).map((faculty, index) => (
                                                                                <tr key={index}>
                                                                                    <td>{faculty.name}</td>
                                                                                    <td>{faculty.designation}</td>
                                                                                    <td>{faculty.mailid}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            ) : project.faculties && Array.isArray(project.faculties) ? (
                                                                <div>
                                                                    <strong>Faculty Members Involved:</strong>
                                                                    <table className="table table-bordered mt-2">
                                                                        <thead className="thead-dark">
                                                                            <tr>
                                                                                <th>Name</th>
                                                                                <th>Designation</th>
                                                                                <th>Mail ID</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {project.faculties.map((faculty, index) => (
                                                                                <tr key={index}>
                                                                                    <td>{faculty.name}</td>
                                                                                    <td>{faculty.designation}</td>
                                                                                    <td>{faculty.mailid}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            ) : null}


                                                {project.report && typeof project.report === "string" ? (
                                                    <p><strong>Reports:</strong> 
                                                        {JSON.parse(project.report).map((file, index) => (
                                                            <span key={index}>
                                                                <a href={`http://localhost:5000/${file}`} target="_blank" rel="noopener noreferrer">
                                                                    View Report {index + 1}
                                                                </a>{' '}
                                                            </span>
                                                        ))}
                                                    </p>
                                                ) : project.report && Array.isArray(project.report) ? (
                                                    <p><strong>Reports:</strong> 
                                                        {project.report.map((file, index) => (
                                                            <span key={index}>
                                                                <a href={`http://localhost:5000/${file}`} target="_blank" rel="noopener noreferrer">
                                                                    View Report {index + 1}
                                                                </a>{' '}
                                                            </span>
                                                        ))}
                                                    </p>
                                                ) : null}
                                            </div>
                                        </div>
                                    )}
                                    
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted">No consultancy projects available.</p>
            )}
        </div>
    );
};

export default ConsultancyProjectsPage;
