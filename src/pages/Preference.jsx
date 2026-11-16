import { useState } from "react"
import { CATEGORIES, RAYONS, AMBIANCES } from "../constants/constant"
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useAddress } from "../hooks/useAddress";
import usePreference from "../hooks/usePreference";
import { useNavigate } from "react-router-dom";
import { submitSearch } from "../services/searchApi";

export default function Preference() {

    const navigate = useNavigate();
    const { address } = useAddress();
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState('');
    const { listCategorie, setListCategorie, ambiance, setAmbiance, rayon, setRayon } = usePreference();
    function toggleCategorie(c) {
        if (listCategorie.includes(c)) {
            setListCategorie(
                listCategorie.filter((l) => l !== c));
            return;
        }
        const newlist = [...listCategorie, c]
        setListCategorie(newlist);

    }
    async function handleValider() {
        setErreur('');
        setChargement(true);
        try {
            const ambiancef = ambiance?.toLowerCase();

            const pref = {
                address: address,
                radius: rayon * 1000,
                indoor_outdoor: ambiancef,
                categories: listCategorie
            }
            const res = await submitSearch(pref);
            if (!res.data.searchCenter?.latitude) {
                setErreur("Adresse introuvable. Vérifiez votre adresse et réessayez.");
                return;
            }
            navigate(`/recommendations/${res.data.searchId}`, { state: { data: res.data } })
        } catch (err) {
            console.error(err);
            setErreur("Impossible de lancer la recherche. Vérifiez votre adresse et réessayez.");
        } finally {
            setChargement(false);
        }
    }
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <p className="text-white text-xs font-semibold uppercase tracking-[0.3em]">
                Vos préférences
            </p>
            <h1 className="titre-manuscrit mt-3">Qu’avez-vous envie de faire ?</h1>
            <p className="font-texte text-white text-sm mt-2">Choisissez une ou plusieurs catégories.</p>
            <div className="grid grid-cols-3 gap-4 w-full max-w-3xl mt-6">
                {CATEGORIES.map((categorie) => (
                    <button type="button" key={categorie} onClick={() => toggleCategorie(categorie)} className={listCategorie.includes(categorie) ? "rounded-xl p-4 bg-lime-200" : "rounded-xl bg-white p-4"}>
                        {categorie}
                    </button>
                ))
                }
            </div>
            {/* Rayon + Ambiance */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-3xl mt-4">

                {/* Rayon de recherche */}
                <div className="rounded-xl bg-white p-4">
                    <div className="flex items-center justify-between">
                        <p className="font-texte text-sm font-bold text-emerald-900">Rayon de recherche</p>
                        <p className="font-texte text-sm font-bold text-emerald-700">{rayon} km</p>
                    </div>
                    <div className="flex gap-2 mt-3">
                        {RAYONS.map((r) => (
                            <button
                                type="button"
                                key={r}
                                onClick={() => setRayon(r)}
                                className={`flex-1 rounded-full py-2 text-xs font-semibold ${r === rayon ? "bg-emerald-700 text-white" : "border border-gray-200 text-emerald-900"}`}
                            >
                                {r} km
                            </button>
                        ))}
                    </div>
                </div>

                {/* Ambiance */}
                <div className="rounded-xl bg-white p-4">
                    <div className="flex items-center justify-between">
                        <p className="font-texte text-sm font-bold text-emerald-900">Ambiance</p>
                        <p className="font-texte text-xs text-gray-400">Optionnel</p>
                    </div>
                    <div className="flex gap-2 mt-3">
                        {AMBIANCES.map((a) => (
                            <button
                                type="button"
                                key={a}
                                onClick={() => setAmbiance(a === ambiance ? null : a)}
                                className={`flex-1 rounded-full py-2 text-xs font-semibold ${a === ambiance ? "bg-emerald-700 text-white" : "border border-gray-200 text-emerald-900"}`}
                            >
                                {a}
                            </button>
                        ))}
                    </div>

                </div>


            </div>
            <button
                type="button"
                onClick={handleValider}
                disabled={chargement}
                className="mt-6 flex items-center gap-3 rounded-full bg-lime-200 px-8 py-4 font-texte font-bold text-emerald-900 hover:bg-lime-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {chargement ? "Recherche en cours…" : "Voir mes recommandations"}
                {chargement
                    ? <LoaderCircle className="w-5 h-5 animate-spin" />
                    : <ArrowRight className="w-5 h-5" />}
            </button>
            {erreur && (
                <p className="mt-4 rounded-xl bg-red-50 px-4 py-2 font-texte text-sm font-semibold text-red-600">
                    {erreur}
                </p>
            )}

        </div>
    )
}