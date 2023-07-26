import React from 'react';
import Layout from './Layout/Layout';
import SiteBar from "./Components/header/SiteBar";


export default function Feedback() {

    return (<>
        <Layout>
            <SiteBar/>
            <div className="container text-center w-50">
                <h1>Це сторінка для пропозицій та ідей, як бачите, тут нічого немає, перейдіть на другу сторінку</h1>
            </div>
        </Layout>
    </>)
}