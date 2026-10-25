"use client";
import { useState, useEffect } from "react";
import style from "@/styles/DraftPage.module.css";

export default function HeroSearchModal({ isModalOpen, closePopUp, heroes, handleHeroSelect }) {
    const [query, setQuery] = useState("");
    const [selectedLane, setSelectedLane] = useState("All Heroes");
    const lanes = ["All Heroes", "Gold Lane", "Exp Lane", "Mid Lane", "Jungle", "Roam"];

    useEffect(() => {
        if (!isModalOpen) {
            setQuery("");
            setSelectedLane("All Heroes");
        }
    }, [isModalOpen])

    if (!isModalOpen) return null;

    const filteredHeroes = heroes.filter(hero =>
        hero.name.toLowerCase().includes(query.toLowerCase())
    );
    const visibleHeroes = selectedLane === "All Heroes"
        ? filteredHeroes
        : filteredHeroes.filter(hero => hero.lane.includes(selectedLane));
    const laneGroups = lanes.slice(1)
        .map(lane => ({
            lane,
            heroes: visibleHeroes.filter(hero => hero.lane.includes(lane)),
        }))
        .filter(group => group.heroes.length > 0);

    function handleKeyDown(e) {
        if (e.key === "Enter" && filteredHeroes.length > 0) {
            e.preventDefault();
            handleHeroSelect(filteredHeroes[0].id);
            closePopUp();
        }
    }

    return (
        <div className={style.overlay} onClick={closePopUp}>
            <div className={style.modal} onClick={(e) => e.stopPropagation()}>
                <button className={style.closeBtn} onClick={closePopUp}>x</button>
                <input
                    type="text"
                    className={style.inputSearch}
                    placeholder="Search heroes..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
                <div className={style.heroLaneTabs} role="tablist" aria-label="Filter heroes by lane">
                    {lanes.map(lane => (
                        <button
                            className={`${style.heroLaneTab} ${selectedLane === lane ? style.activeHeroLaneTab : ""}`}
                            key={lane}
                            id={`hero-lane-tab-${lane.toLowerCase().replaceAll(" ", "-")}`}
                            type="button"
                            role="tab"
                            aria-selected={selectedLane === lane}
                            onClick={() => setSelectedLane(lane)}
                        >
                            {lane}
                        </button>
                    ))}
                </div>
                <div className={style.heroSelectionSection}>
                    {visibleHeroes.length ? (
                        selectedLane === "All Heroes" ? (
                            <div
                                className={style.heroLaneGroups}
                                role="tabpanel"
                                aria-labelledby="hero-lane-tab-all-heroes"
                            >
                                {laneGroups.map(({ lane, heroes: laneHeroes }) => (
                                    <div className={style.heroLaneGroup} key={lane}>
                                        <h3 className={style.heroLaneTitle}>{lane}</h3>
                                        <div className={style.heroGrid}>
                                            {laneHeroes.map(hero => (
                                                <HeroOption
                                                    key={`${lane}-${hero.id}`}
                                                    hero={hero}
                                                    handleHeroSelect={handleHeroSelect}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div
                                className={style.heroGrid}
                                role="tabpanel"
                                aria-labelledby={`hero-lane-tab-${selectedLane.toLowerCase().replaceAll(" ", "-")}`}
                            >
                                {visibleHeroes.map(hero => (
                                    <HeroOption
                                        key={hero.id}
                                        hero={hero}
                                        handleHeroSelect={handleHeroSelect}
                                    />
                                ))}
                            </div>
                        )
                    ) : (
                        <p className={style.heroFilterMessage}>No heroes found.</p>
                    )}
                </div>
            </div>
        </div >
    )
}

function HeroOption({ hero, handleHeroSelect }) {
    return (
        <button
            className={style.heroItem}
            onClick={() => handleHeroSelect(hero.id)}
        >
            <img
                src={hero.icons.round}
                alt=""
                className={style.heroIcon}
            />
            <span className={style.heroName}>
                {hero.name}
            </span>
        </button>
    );
}