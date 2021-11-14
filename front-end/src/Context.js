import React, {useState} from 'react'

export const Context = React.createContext();

export function ContextProvider ({
  children
}) {
  const [access_token, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  return (
    <Context.Provider value={{
        access_token: access_token,
        user: user,
        login: (user) => {
            if(user && !user.email){
            throw Error("Invalid user");
            }
            setUser(user);
        },
        logout: () => {
            setAccessToken(null);
            setUser(null);
        },
        saveToken: (token)=>{
          setAccessToken(token.access_token);
        }
    }}>{children}</Context.Provider>
  )
}