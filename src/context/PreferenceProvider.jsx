import { PreferenceContext } from "./PreferenceContext";
import { useState } from "react";

export default function PreferenceProvider({ children }) {
    const [ambiance, setAmbiance] = useState(null);
    const [rayon, setRayon] = useState(15);
    const [listCategorie, setListCategorie] = useState([]);
    return (

        <PreferenceContext.Provider value={{ ambiance, setAmbiance, rayon, setRayon, listCategorie, setListCategorie }}>
            {children}
        </PreferenceContext.Provider>


    )
}