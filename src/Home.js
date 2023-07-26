import React from 'react';
import Layout from './Layout/Layout';
import SiteBar from "./Components/header/SiteBar";


export default function Home() {

    return (<>
        <Layout>
        <SiteBar/>
            <div className="container text-center w-50">
                <h1>Вітаю вас, ви можете протестувати цей сайт відкривши сайт бар зліва, ця сторінка поки що не працює</h1>
            </div>
        </Layout>
    </>)
}