import React from 'react';
import Layout from './Layout/Layout';
import SiteBar from "./Components/header/SiteBar";


export default function About() {

    return (<>
        <Layout>
            <SiteBar/>
            <div className="container text-center w-50">
                <h1>Це сторінка про нас, як бачите, тут нічого немає, перейдіть на другу сторінку</h1>
            </div>
        </Layout>
    </>)
}