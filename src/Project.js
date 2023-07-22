import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from './Layout/Layout';
import SiteBar from './Components/header/SiteBar';
import ModalCreateProject from './Components/content/ModalCreateProject';
import withAuthentication from './withAuthentication';
import './style/project.css';
import './style/loading.css';
import Loading from "./Components/Loading";

function Project() {
    const [information, setInformation] = useState([]);
    const [avatarUrl, setAvatarUrl] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectsResponse, usersResponse] = await Promise.all([
                    axios.get(`https://bvbvbvbvbudw-001-site1.atempurl.com/api/projects?user_id=${localStorage.getItem('userName')}`),
                    axios.get('https://bvbvbvbvbudw-001-site1.atempurl.com/api/users')
                ]);
                const projects = projectsResponse.data.response.tasks.data;
                const users = usersResponse.data.response.users.data;
                const avatarsUser = [];

                const projectsWithUserName = projects.map(project => {
                    const creator = users.find(user => user.id === project.creator_id);
                    if (!avatarsUser.includes(creator.id)) {
                        avatarsUser.push(creator.id);
                    }
                    const creatorName = creator ? creator.name : 'Unknown';
                    return { ...project, creator_name: creatorName };
                });

                const projectsWithFavorite = await Promise.all(
                    projectsWithUserName.map(async project => {
                        const isFavorite = await isProjectFavorite(project.id);
                        return { ...project, isFavorite };
                    })
                );

                setInformation(projectsWithFavorite);
                startLoadingAvatar(avatarsUser);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        const startLoadingAvatar = async avatarsUser => {
            const avatarPromises = avatarsUser.map(avatar =>
                axios.get(`https://bvbvbvbvbudw-001-site1.atempurl.com/api/avatarLoad?user_id=${avatar}`)
            );

            try {
                const responses = await Promise.all(avatarPromises);
                const avatarData = responses.map(response => response.data);
                setAvatarUrl(prevAvatars => [...prevAvatars, ...avatarData]);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        const sitebar = document.getElementById('sitebar');
        const mainPage = document.getElementById('project-page');

        const handleSitebarToggle = () => {
            if (sitebar.classList.contains('closed')) {
                mainPage.classList.remove('maxSize');
            } else {
                mainPage.classList.add('maxSize');
            }
        };

        handleSitebarToggle();
        sitebar.addEventListener('transitionend', handleSitebarToggle);

        return () => {
            sitebar.removeEventListener('transitionend', handleSitebarToggle);
        };
    }, []);

    const handleStarClick = async (event, project) => {
        const star = event.target;
        const isFavorite = star.classList.contains('on-star');

        if (isFavorite) {
            star.classList.remove('on-star');
            await axios.post(`https://bvbvbvbvbudw-001-site1.atempurl.com/api/favorite`, {
                user_id: localStorage.getItem('userName'),
                project_id: project
            });
        } else {
            star.classList.add('on-star');
            await axios.post(`https://bvbvbvbvbudw-001-site1.atempurl.com/api/favorite`, {
                user_id: localStorage.getItem('userName'),
                project_id: project
            });
        }

        setInformation(prevInformation =>
            prevInformation.map(item => (item.id === project ? { ...item, isFavorite: !isFavorite } : item))
        );
    };
    const isProjectFavorite = async (projectId) => {
        try {
            const response = await axios.get(
                `https://bvbvbvbvbudw-001-site1.atempurl.com/api/favorite/toggle?user_id=${localStorage.getItem('userName')}&project_id=${projectId}`
            );
            return response.data.favoriteExists;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const handleSearchInputChange = event => {
        setSearchInput(event.target.value);
    };
    const filteredProjects = information.filter(project =>
        project.project.toLowerCase().includes(searchInput.toLowerCase())
    );


    return (
        <Layout>
            <SiteBar />
            <div className="project-page" id="project-page">
                <div className="search">
                    <h3>Projects</h3>
                    <input
                        type="text"
                        className="search-input"
                        value={searchInput}
                        onChange={handleSearchInputChange}
                    />
                    <select name="" id="" defaultValue="1">
                        <option value="1">All Jira product</option>
                        <option value="">2</option>
                        <option value="">3</option>
                        <option value="">4</option>
                    </select>
                    <ModalCreateProject />
                </div>

                <div className="container-table">
                    <table>
                        <thead>
                        <tr>
                            <th>&#9733;</th>
                            <th>Ім'я</th>
                            <th>Ключ</th>
                            <th>Тип</th>
                            <th>Автор</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading && <Loading display="visible" />}
                        {filteredProjects.map(project => (
                            <tr key={project.id}>
                                <td
                                    className={`star ${project.isFavorite ? 'on-star' : ''}`}
                                    onClick={event => handleStarClick(event, project.id)}
                                >
                                    &#9733;
                                </td>
                                <td>
                                    <a
                                        href={`backlog/${project.id}`}
                                        onClick={() => localStorage.setItem('currentProject', project.project)}
                                    >
                                        {project.project}
                                    </a>
                                </td>
                                <td>-----</td>
                                <td>-----</td>
                                <td>
                                    <a href="/">
                                        {avatarUrl.find(avatar => parseInt(avatar.user_id) === parseInt(project.creator_id)) && (
                                            <img
                                                src={`https://bvbvbvbvbudw-001-site1.atempurl.com/storage/${avatarUrl.find(
                                                    avatar => parseInt(avatar.user_id) === parseInt(project.creator_id)
                                                ).avatar}`}
                                                className={'avatar'}
                                                title={
                                                    avatarUrl.find(avatar => parseInt(avatar.user_id) === parseInt(project.creator_id)).user.name
                                                }
                                                alt="avatar"
                                            />
                                        )}
                                        {project.creator_name}
                                    </a>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}
// export default Project
export default withAuthentication(Project);
