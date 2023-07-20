import React from 'react';
import './style/welcome.css';

import first from './images/Carousel_Image_Lists_2x_preview_rev_1.png';
import second from './images/TrelloUICollage_4x.webp';

export default function Welcome(){

    return(<>
    <div className="wrapper-welcome">
        <div className="container-welcome">
            <img src={first} alt="" style={{width: '595px' , height:"405px"}}/>

            <div className="container-infortmation-welcome">
                <h1>Jira copy!</h1>
                <div className="container-welcome-inside">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Accusantium alias enim ipsum laborum modi natus nemo neque quae sed,
                        velit. Dicta laborum minima odit officia, perferendis quidem reiciendis saepe voluptatibus.
                    </p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Accusantium alias enim ipsum laborum modi natus nemo neque quae sed,
                        velit. Dicta laborum minima odit officia, perferendis quidem reiciendis saepe voluptatibus.
                    </p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Accusantium alias enim ipsum laborum modi natus nemo neque quae sed,
                        velit. Dicta laborum minima odit officia, perferendis quidem reiciendis saepe voluptatibus.
                    </p>
                    <div className="d-flex gap-3 container-buttons-welcome">
                        <button className='btn btn-primary'><a href="/auth">Login</a></button>
                        <button className='btn btn-warning'><a href='/auth'>Register</a></button>
                    </div>
                </div>
            </div>

            <img src={second} alt="" style={{width: '650px' , height: "605px"}}/>
        </div>
    </div>
    </>)
}