import { useState } from 'react'

export function Login() {
    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const url = "http://localhost:8080/login";

    const handleUsernameChange = (e) => {
        setUsernameInput(e.target.value);
    }
    const handlePasswordChange = (e) => {
        setPasswordInput(e.target.value);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (usernameInput !== "" && passwordInput !== "") {
            setIsLoading(true);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: usernameInput, password: passwordInput })
              });
            const status = response.status;
            console.log("Finished authorizing");
            if (status == 200) {
                const data = await response.json();
                localStorage.setItem('token', data['token']);
            } 
            setIsLoading(false);
            window.location.reload();
        } 
    }

    return (
    <>
    <b>Author Login</b>
    <form onSubmit={handleSubmit}>
                <input placeholder="Username" type="text" value={usernameInput} onChange={handleUsernameChange}></input>
                <input placeholder="Password" type="password" value={passwordInput} onChange={handlePasswordChange}></input>
                <button disabled={isLoading} type="submit">Login</button>
    </form>
    </>
    )
}