import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../utils/api';
import { Link } from 'react-router-dom';

const fetchEmployees = async (search = {}) => {
    const params = new URLSearchParams(search).toString();
    const res = await API.get(`/emp/employees/search?${params}`);
    return res.data;
};

const EmployeeList = () => {
    const [search, setSearch] = useState({ department: '', position: '' });
    const queryClient = useQueryClient();

    const { data: employees, isLoading, error, refetch } = useQuery({
        queryKey: ['employees', search],
        queryFn: () => fetchEmployees(search)
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => API.delete(`/emp/employees/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['employees']);
        }
    });

    const handleSearch = (e) => {
        e.preventDefault();
        refetch();
    };

    const handleDelete = (id) => {
        if(window.confirm('Are you sure?')) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="alert alert-danger">Error loading employees</div>;

    return (
        <div className="container">
            <h2 className="mb-4">Employee List</h2>
            <div className="row mb-4">
                <form className="d-flex gap-2" onSubmit={handleSearch}>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search Department" 
                        value={search.department}
                        onChange={(e) => setSearch({...search, department: e.target.value})}
                    />
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search Position" 
                        value={search.position}
                        onChange={(e) => setSearch({...search, position: e.target.value})}
                    />
                    <button type="submit" className="btn btn-outline-primary">Search</button>
                </form>
            </div>
            <Link to="/employees/add" className="btn btn-success mb-3">Add Employee</Link>
            
            <table className="table table-striped table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Position</th>
                        <th>Department</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(emp => (
                        <tr key={emp._id}>
                            <td>
                                {emp.profile_pic ? (
                                    <img src={`http://localhost:5000${emp.profile_pic}`} alt="profile" style={{width: '50px', height: '50px', objectFit: 'cover'}} />
                                ) : 'N/A'}
                            </td>
                            <td>{emp.first_name} {emp.last_name}</td>
                            <td>{emp.email}</td>
                            <td>{emp.position}</td>
                            <td>{emp.department}</td>
                            <td>
                                <Link to={`/employees/${emp._id}`} className="btn btn-info btn-sm me-2">View</Link>
                                <Link to={`/employees/edit/${emp._id}`} className="btn btn-warning btn-sm me-2">Edit</Link>
                                <button onClick={() => handleDelete(emp._id)} className="btn btn-danger btn-sm">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeList;