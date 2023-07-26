import React from 'react';
import Layout from './Layout/Layout';
import SiteBar from "./Components/header/SiteBar";


export default function Contact() {

    return (<>
        <Layout>
            <SiteBar/>
            <div className="container text-center w-50">
                <h1>Це сторінка контактів, як бачите, тут нічого немає, перейдіть на другу сторінку</h1>
            </div>
        </Layout>
    </>)
}