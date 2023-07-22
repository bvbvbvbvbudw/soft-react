import axios from 'axios';
import React, { useState } from 'react';

export default function AvatarUpload() {
    const currentUser = localStorage.getItem('userName');
    const [selectedFile, setSelectedFile] = useState(null);

    const uploadAvatar = () => {
        if (!selectedFile) {
            console.log('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('avatar', selectedFile);
        formData.append('user_id', currentUser);
        axios
            .post('https://bvbvbvbvbudw-001-site1.atempurl.com/api/avatar', formData)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleUpload = () => {
        uploadAvatar();
        setSelectedFile(null);
    };

    return (
        <>
            <input type="file" onChange={handleFileChange}/>
            <button onClick={handleUpload} className='btn btn-primary disabled'>Upload</button>
        </>
    );
}