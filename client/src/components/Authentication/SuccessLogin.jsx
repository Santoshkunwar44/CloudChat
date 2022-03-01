import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const SuccessLogin = () => {
    const [user, setUser] = useState()
    const navigate = useNavigate()


    const getUser = () => {
        fetch("http://localhost:8000/auth/login/github/success", {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true,
            },
        })
            .then((response) => {
                if (response.status === 200) return response.json();
                throw new Error("authentication has been failed!");
            })
            .then((resObject) => {
                setUser(resObject.user);

                localStorage.setItem("userInfo", JSON.stringify(resObject.user))
                // navigate("/chatpage")
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        getUser();
    }, []);
    return (
        <div> HWLLO YOU LOGGED IN SUCCESFFULY {user?.username}</div>
    )
}
