"use client"
import { useState, useEffect } from "react";
import style from "@/styles/DraftPage.module.css";
import DraftPanel from "@/components/DraftPanel";
import SuggestionPanel from "@/components/SuggestionPanel";
import HeroSearchModal from "@/components/HeroSearchModal";

export default function DraftPage() {
    const [heroes, setHeroes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [banSlots, setBanSlots] = useState(Array(10).fill(null));
    const [allySlots, setAllySlots] = useState(Array(5).fill(null));
    const [enemySlots, setEnemySlots] = useState(Array(5).fill(null));
    const setters = {
        Banned: setBanSlots,
        Allies: setAllySlots,
        Enemies: setEnemySlots
    }

    const [selectedSlot, setSelectedSlot] = useState({ panel: null, index: null });
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetch("/data/heroes_draft_data.json")
            .then(res => res.json())
            .then(data => setHeroes(data))
            .catch(err => console.error(err))
    }, []);

    function closePopUp() {
        setIsModalOpen(false);
    }
    function openPopUp() {
        setIsModalOpen(true);
    }

    function resetDraft() {
        setBanSlots(Array(10).fill(null));
        setAllySlots(Array(5).fill(null));
        setEnemySlots(Array(5).fill(null));
    }

    function handleNullSlotClick(panel, index) {
        const setter = setters[panel];
        if (!setter) {
            console.error("Unknown panel selected");
            return;
        }
        setter(prev => {
            const updated = [...prev];
            updated[index] = null;
            return updated;
        })
    }

    function handleSlotClick(panel, index) {
        setSelectedSlot({ panel, index })
        openPopUp();
    }

    function handleHeroSelect(heroId) {
        const { panel, index } = selectedSlot;
        const setter = setters[panel];
        if (!setter) return;

        const isTaken =
            banSlots.includes(heroId) ||
            allySlots.includes(heroId) ||
            enemySlots.includes(heroId)

        if (isTaken) {
            setErrorMessage(`${heroes[heroId - 1].name} è già stato scelto!`);
            setTimeout(() => setErrorMessage(""), 3000);
            closePopUp();
            return;
        }

        setter(prev => {
            const updated = [...prev];
            updated[index] = heroId;
            return updated;
        });

        closePopUp();
    }

    return (
        <main>
            {/* Error Banner*/}
            {errorMessage && (
                <div className={style.errorBanner}>
                    {errorMessage}
                </div>
            )}

            {/* Draft Panels */}
            <section>
                {/* <DraftPanel
                    title="Banned"
                    handleSlotClick={handleSlotClick}
                    handleNullSlotClick={handleNullSlotClick}
                    slots={banSlots}
                    heroes={heroes}
                /> */}
                <DraftPanel
                    title="Allies"
                    handleSlotClick={handleSlotClick}
                    handleNullSlotClick={handleNullSlotClick}
                    slots={allySlots}
                    heroes={heroes}
                />
                <DraftPanel
                    title="Enemies"
                    handleSlotClick={handleSlotClick}
                    handleNullSlotClick={handleNullSlotClick}
                    slots={enemySlots}
                    heroes={heroes}
                />
                <button className="btn" onClick={resetDraft}>Reset Draft</button>
            </section>

            {/* Suggestions */}
            <section>
                <SuggestionPanel
                    heroes={heroes}
                    bans={banSlots}
                    allies={allySlots}
                    enemies={enemySlots}
                />
            </section>

            {/* HeroSearchModal component */}
            <HeroSearchModal
                isModalOpen={isModalOpen}
                closePopUp={closePopUp}
                heroes={heroes}
                handleHeroSelect={handleHeroSelect}
            />
        </main >
    )
}