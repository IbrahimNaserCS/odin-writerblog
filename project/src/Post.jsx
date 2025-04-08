import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export function Post() {
    const params = useParams();
    const id = params.id;
    console.log("Id is: ", id)
    const [postContent, setPostContent] = useState(null);
    const [postTitle, setPostTitle] = useState(null);
    const url = `http://localhost:8080/post/${id}`;
    const [isLoading, setIsLoading] = useState(false);
    console.log("url is: ", url);
    useEffect(() => {
        async function fetchData() {
            const response = await fetch(url,{ mode: 'cors'});
            const data = await response.json();
            return data;
        }
        const logData = async () => {
            const data = await fetchData();
            console.log("Data is: ", data);
            setPostContent(data.content);
            setPostTitle(data.title);
        }
        logData();
        }, []);

    const [commentsJson, setCommentsJson] = useState(null);
    const url2 = `http://localhost:8080/comment/${id}`;
    console.log("url is: ", url);
    useEffect(() => {
        async function fetchData() {
            const response = await fetch(url2,{ mode: 'cors'});
            const data = await response.json();
            return data;
        }
        const logData = async () => {
            const data = await fetchData();
            console.log("Data is: ", data);
            setCommentsJson(data);
        }
        logData();
        }, []);

    const handleDelete = async (e) => {
        const commentid = e.target.id;
        const url3 = `http://localhost:8080/comment/${commentid}`;
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(url3, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            });
        setIsLoading(false);
        if (response.ok) {
            const updatedComments = await fetch(url2, { mode: 'cors' });
            const data = await updatedComments.json();
            setCommentsJson(data);
        } else {
            console.log("Failed to delete comment");
        }
        } 
    
        const handleTitleChange = (e) => {
            setPostTitle(e.target.value);
        }
        const handleContentChange = (e) => {
            setPostContent(e.target.value);
        }
        const handleSubmit = async (e) => {
            e.preventDefault();
            if (postTitle !== "" && postContent !== "") {
                const token = localStorage.getItem('token');
                setIsLoading(true);
                const response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ newcontent: postContent, newtitle: postTitle })
                  });
                setIsLoading(false);
                if (response.ok) {
                    const updatedPosts = await fetch(url, { mode: 'cors' });
                    const data = await updatedPosts.json();
                    setPostContent(data.content);
                    setPostTitle(data.title);
                } else {
                    console.log("Failed to post");
                }
            } 
        }
    return (
    <>
    {!postContent || !postTitle || !commentsJson ? (
        <div>Loading...</div>
    ) : (
        <div>
    <form onSubmit={handleSubmit}>
        <p><input value={postTitle} onChange={handleTitleChange}></input></p>
        <textarea value={postContent} style={{ height: '200px', width: '500px' }} onChange={handleContentChange}></textarea>
        <button disabled={isLoading} type="submit">Submit Changes</button>
    </form>
    <b>Comments</b>
    <ul>
            {commentsJson.map((item, index) => (
                <>
                <p key={index}>{item.commentorName}: {item.content}<button id={item.id} disabled={isLoading} onClick={handleDelete}>Delete</button></p>
                </>
            ))}
          </ul>
          </div>
    )}
    </>
    )
}