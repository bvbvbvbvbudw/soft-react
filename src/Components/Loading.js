import React from 'react';
import '../style/loading.css';

const Loader = ({ display }) => {
    return <div className={`loader-circle ${display ? 'visible' : 'hidden'}`}></div>;
};

export default Loader;
