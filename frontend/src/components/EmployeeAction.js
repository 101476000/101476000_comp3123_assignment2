import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const EmployeeAction = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        first_name: '', last_name: '', email: '', 
        position: '', salary: '', date_of_joining: '', department: ''
    });
    const [file, setFile] = useState(null);

    // Fetch if Edit
    useQuery({
        queryKey: ['employee', id],
        queryFn: async () => {
            const res = await API.get(`/emp/employees/${id}`);
            const data = res.data;
            setFormData({
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                position: data.position,
                salary: data.salary,
                date_of_joining: data.date_of_joining.split('T')[0],
                department: data.department
            });
            return data;
        },
        enabled: isEdit
    });

    const mutation = useMutation({
        mutationFn: (data) => {
            if (isEdit) return API.put(`/emp/employees/${id}`, data);
            return API.post('/emp/employees', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['employees']);
            navigate('/employees');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if(file) data.append('image', file);
        
        mutation.mutate(data);
    };

    return (
        <div className="container col-md-6">
            <h2>{isEdit ? 'Edit Employee' : 'Add Employee'}</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label>First Name</label>
                        <input type="text" className="form-control" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label>Last Name</label>
                        <input type="text" className="form-control" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} required />
                    </div>
                </div>
                <div className="mb-3">
                    <label>Email</label>
                    <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div className="mb-3">
                    <label>Department</label>
                    <input type="text" className="form-control" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} required />
                </div>
                <div className="mb-3">
                    <label>Position</label>
                    <input type="text" className="form-control" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} required />
                </div>
                <div className="mb-3">
                    <label>Salary</label>
                    <input type="number" className="form-control" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} required />
                </div>
                <div className="mb-3">
                    <label>Date of Joining</label>
                    <input type="date" className="form-control" value={formData.date_of_joining} onChange={e => setFormData({...formData, date_of_joining: e.target.value})} required />
                </div>
                <div className="mb-3">
                    <label>Profile Picture</label>
                    <input type="file" className="form-control" onChange={e => setFile(e.target.files[0])} />
                </div>
                <button type="submit" className="btn btn-primary">{isEdit ? 'Update' : 'Save'}</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/employees')}>Cancel</button>
            </form>
        </div>
    );
};

export default EmployeeAction;