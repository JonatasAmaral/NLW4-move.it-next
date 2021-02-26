import {createContext, useState, ReactNode, useRef} from 'react'
import challenges from '../../challenges.json'

interface Challenge {
    type: 'body' | 'eye';
    description: string;
    amount: number;
}

interface ChallengesContextData{
    level: number;
    currentExperience: number;
    challengesCompleted: number;
    levelUp: ()=>void;
    startNewChallenge: ()=>void;
    activeChallenge: Challenge;
    resetChallenge: ()=>void;
    experienceToNextLevel: number;
    percentToNextLevel: number;
    completeChallenge: (xp)=>void;
    chalengeRef: any;   
}
export const ChallengesContext = createContext({} as ChallengesContextData);

interface ChallengesProviderProps {
    children: ReactNode
}

export function ChallengesProvider ( {children}:ChallengesProviderProps ) {
    const [level, setLevel] = useState(1);
    const [currentExperience, setCurrentExperience] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(0);

    const [activeChallenge, setActiveChallenge] = useState(null);

    const experienceToNextLevel = Math.pow((level+1)*4,2);
    const percentToNextLevel = Math.round((currentExperience*100)/experienceToNextLevel)

    const chalengeRef = useRef();


    function levelUp(exeed?:number) {
        setLevel(level + 1);
        setCurrentExperience(exeed || 0);
    }

    function gainExperience(amount: number = 0){
                
        let newExperience = 0;
        newExperience = (currentExperience + amount)

        if (newExperience >= experienceToNextLevel){
            let exeed = newExperience-experienceToNextLevel
            setTimeout(()=>levelUp(exeed),1000)

            newExperience = experienceToNextLevel; // stale exp bar a sec in max position, for user visual feedback
        }
        else newExperience = newExperience<0? 0:newExperience // for LOSE experience purpose, never lose LEVEL
        
        setCurrentExperience(newExperience);
    }

    function startNewChallenge(){
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        setActiveChallenge(challenges[randomChallengeIndex]);
        
        // scroll page to the unlocked challenge on smalls screens. "Hardcoding"
        // setTimeout(()=>document.getElementById("chalengeBoxElement").scrollIntoView(), 500)
        // TODO: scroll page to challenge by exporting a React useRef.
        // Works nicelly, but VS Code acuse error: "possibly undefined"
        setTimeout(()=>{ chalengeRef.current.scrollIntoView({ behavior: 'smooth' }) }, 500)
    }
    function completeChallenge(xp){
        if (!activeChallenge) return;
        resetChallenge();
        setChallengesCompleted(challengesCompleted+1);
        gainExperience(xp);
    }
    function resetChallenge(){
        setActiveChallenge(null);
    }
    

    return (
        <ChallengesContext.Provider value={{
            level, levelUp,
            currentExperience,
            challengesCompleted,
            activeChallenge,
            chalengeRef,
            experienceToNextLevel, percentToNextLevel,
            startNewChallenge, completeChallenge, resetChallenge
        }}>
            {children}
        </ChallengesContext.Provider>
    )
};