import { Outlet, Link } from "react-router-dom";
import "../styles/layout.css";
import '../styles/pages.css';
import '../styles/buttons.css';
import '../styles/containers.css';
import { DespButton } from "./buttons/DespButton";
import { useState } from "react";
export function Layout(){
    const [active, setActive] = useState(false);
    return (
        <div className="layout">
            <header className="header">
                <div className="logo">Art Shader</div>
                <nav className="nav">
                    <ul className="nav-bar">
                        <li>
                            <div className="link-container">
                                <Link className="link" to="/">Home</Link>
                            </div>
                        </li>
                        <li>
                            <div className="link-container">
                                <Link className="link" to="/gallery">Gallery</Link>    
                            </div>
                            
                        </li>
                        <li>
                            <div className="link-container">
                                <Link className="link" to="/texture">Texture</Link>
                            </div> 
                        </li>
                    </ul>
                </nav>
            </header>
            <div className="content">
                <Outlet/>
            </div>
            <footer className={active? 'footer active': 'footer'}>
                <DespButton active={active} action={setActive}/>
                <div className="content-footer">Footer</div>
            </footer>

        </div>
    ); 
}