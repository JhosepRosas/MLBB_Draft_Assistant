"use client"
import style from "@/styles/DraftPage.module.css";
import { calculateSuggestion } from "@/lib/draftLogic";

const lanes = ["Gold Lane", "Exp Lane", "Mid Lane", "Jungle", "Roam"];

export default function SuggestionPanel({ heroes, bans, allies, enemies }) {
    return (
        <div className={style.suggestionColumns}>
            {lanes.map(lane => {
                const suggestions = calculateSuggestion({
                    allies,
                    enemies,
                    bans,
                    pickedLane: lane,
                }, heroes);

                return (
                    <section className={style.suggestionColumn} key={lane}>
                        <h3>{lane}</h3>
                        {suggestions.length ? (
                            <div className={style.suggestedHeroes}>
                                {suggestions.map(hero => {
                                    const suggestedHero = heroes[hero.heroId - 1];
                                    const formattedScore = hero.score > 0
                                        ? `+${hero.score.toFixed(1)}`
                                        : hero.score.toFixed(1);

                                    return (
                                        <div key={hero.heroId} className={style.suggestedHero}>
                                            <img src={suggestedHero.icons.round} alt="" />
                                            <div className={style.heroDescription}>
                                                <p>{suggestedHero.name}</p>
                                                {hero.pros.length > 0 && (
                                                    <ul className={style.greenColor}>
                                                        {hero.pros.map((reason, i) => (
                                                            <li key={i}>{reason}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                                {hero.cons.length > 0 && (
                                                    <ul className={style.redColor}>
                                                        {hero.cons.map((reason, i) => (
                                                            <li key={i}>{reason}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                            <p className={style.heroScore}>{formattedScore}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className={style.noSuggestions}>No suggestions yet.</p>
                        )}
                    </section>
                );
            })}
        </div>
    );
}