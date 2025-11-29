import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import API from '../utils/api';

const EmployeeDetail = () => {
    const { id } = useParams();
    const { data: emp, isLoading, error } = useQuery({
        queryKey: ['employee', id],
        queryFn: async () => {
            const res = await API.get(`/emp/employees/${id}`);
            return res.data;
        }
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading details</div>;

    return (
        <div className="container col-md-6">
            <div className="card">
                <div className="card-header bg-info text-white">
                    <h3>Employee Details</h3>
                </div>
                <div className="card-body text-center">
                    {emp.profile_pic && <img src={`http://localhost:5000${emp.profile_pic}`} alt="profile" className="rounded-circle mb-3" style={{width: '150px', height: '150px', objectFit: 'cover'}} />}
                    <h4>{emp.first_name} {emp.last_name}</h4>
                    <p><strong>Email:</strong> {emp.email}</p>
                    <p><strong>Department:</strong> {emp.department}</p>
                    <p><strong>Position:</strong> {emp.position}</p>
                    <p><strong>Salary:</strong> ${emp.salary}</p>
                    <p><strong>Joined:</strong> {new Date(emp.date_of_joining).toDateString()}</p>
                    <Link to="/employees" className="btn btn-primary mt-3">Back to List</Link>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetail;