import { Link } from "react-router-dom";
import { useEffect, useState } from 'react'

export function Posts() {
    const [postsJson, setPostsJson] = useState(null);
    const [titleInput, setTitleInput] = useState("");
    const [contentInput, setContentInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const url = "http://localhost:8080/post";
      useEffect(() => {
        console.log("In use effect");
        async function fetchData() {
          console.log("Called");
          const response = await fetch(url,{ mode: 'cors'});
          const data = await response.json();
          console.log(data);
          return data;
        }
        const logData = async () => {
          const data = await fetchData();
          setPostsJson(data);
        }
        logData();
      }, [])
    const token = localStorage.getItem('token');
    const handleTitleChange = (e) => {
        setTitleInput(e.target.value);
    }
    const handleContentChange = (e) => {
        setContentInput(e.target.value);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (titleInput !== "" && contentInput !== "") {
            setIsLoading(true);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: contentInput, title: titleInput })
              });
            setIsLoading(false);
            if (response.ok) {
                const updatedPosts = await fetch(url, { mode: 'cors' });
                const data = await updatedPosts.json();
                setPostsJson(data);
                setTitleInput("");
                setContentInput("");
            } else {
                console.log("Failed to post");
            }
        } 
    }
    const handleClick = () => {
        localStorage.setItem('token', '');
        window.location.reload();
    }

    return (
      <>
        {!postsJson ? (
          <div>Loading...</div>
        ) : (
            <>
            <button onClick={handleClick}>Logout</button>
            <form onSubmit={handleSubmit}>
                <p><input placeholder="Title" type="text" value={titleInput} onChange={handleTitleChange}></input></p>
                <textarea placeholder="Content" type="text" value={contentInput} onChange={handleContentChange}></textarea>
                <button disabled={isLoading} type="submit">Post</button>
            </form>
          <ul>
            {postsJson.map((item, index) => (
                <p key={index}>
              <Link to={`/post/${item.id}`} >{item.title} ({item.date.slice(0, 10)})</Link>
              </p>
            ))}
          </ul>
          </>
        )}
      </>
    );
  }  