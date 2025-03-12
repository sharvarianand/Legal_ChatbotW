import React, { useEffect, useState } from 'react';

const FileCheckComponent = () => {
    const [fileStatuses, setFileStatuses] = useState({});

    useEffect(() => {
        const fetchFileStatuses = async () => {
            const response = await fetch('/check');
            const data = await response.json();
            setFileStatuses(data);
        };

        fetchFileStatuses();
    }, []);

    return (
        <div>
            <h2>Uploaded Files Status</h2>
            <ul>
                {Object.entries(fileStatuses).map(([fileName, status]) => (
                    <li key={fileName}>
                        {fileName}: {status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileCheckComponent;
