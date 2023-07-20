import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function withAuthentication(Component) {
    function WrappedComponent() {
        const navigate = useNavigate();

        useEffect(() => {
            const checkAuthentication = async () => {
                const token = localStorage.getItem('token');
                try {
                    const response = await axios.get('http://127.0.0.1:8000/api/check-authentication', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.status !== 200) {
                        navigate('/welcome');
                    }
                } catch (error) {
                    navigate('/welcome');
                }
            };

            checkAuthentication();
        }, [navigate]);


        return <Component />;
    }
    return WrappedComponent;
}
export default withAuthentication;