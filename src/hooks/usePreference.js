import { useContext } from "react";
import { PreferenceContext } from "../context/PreferenceContext";

export default function usePreference() {
    const ctx = useContext(PreferenceContext)
    if (ctx === null) throw new Error("usePreference doit être utilisé dans <PreferenceProvider>");
    return ctx;
} 