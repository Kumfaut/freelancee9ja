import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JobModeration = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/admin/jobs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setJobs(res.data);
        };
        fetchJobs();
    }, []);

    const updateJobStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/admin/jobs/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setJobs(jobs.map(j => j.job_id === id ? { ...j, status } : j));
        } catch (error) {
            alert("Error updating job");
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md mt-6">
            <h2 className="text-2xl font-bold mb-4">Job Moderation</h2>
            <div className="space-y-4">
                {jobs.map(job => (
                    <div key={job.job_id} className="border p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">{job.title}</h3>
                            <p className="text-sm text-gray-500">Client: {job.client_name} | Budget: ₦{job.budget}</p>
                            <span className={`text-xs font-bold uppercase ${job.status === 'pending' ? 'text-orange-500' : 'text-green-500'}`}>
                                Status: {job.status}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            {job.status === 'pending' && (
                                <>
                                    <button onClick={() => updateJobStatus(job.job_id, 'approved')} className="bg-green-600 text-white px-4 py-2 rounded text-sm">Approve</button>
                                    <button onClick={() => updateJobStatus(job.job_id, 'rejected')} className="bg-red-600 text-white px-4 py-2 rounded text-sm">Reject</button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JobModeration;