import React, { useState, useEffect } from "react";
import { FaFilm } from "react-icons/fa";

const CoolFacts = () => {
  const movieFacts = [
    "The Lion King was originally called 'King of the Jungle' — but lions don't live in jungles.",
    "The iconic 'I see dead people' kid in The Sixth Sense almost wasn’t Haley Joel Osment.",
    "Alfred Hitchcock used chocolate syrup for blood in Psycho's shower scene.",
    "Lord of the Rings has over 500 hours of behind-the-scenes footage — that's more than 20 days!",
    "The longest movie ever made, Logistics, is over 35 days long.",
    "Tom Hanks wasn't paid a salary for Forrest Gump — he took a share of the profits and made over $40 million.",
    "James Cameron drew Rose’s portrait in Titanic himself.",
    "Keanu Reeves gave away $75 million of his Matrix earnings to crew members.",
    "Interstellar's black hole visual was so accurate, scientists published a paper on it.",
    "There's a Starbucks cup hidden in every scene of Fight Club.",
    "Inception only had 500 VFX shots — much was done in-camera.",
    "E.T.’s walk sound came from squishing jelly in hands.",
    "Jack Nicholson improvised the line 'Here’s Johnny!' in The Shining.",
    "The snow in The Wizard of Oz was made from asbestos.",
    "R2-D2’s name comes from 'Reel 2, Dialogue 2'.",
    "Slumdog Millionaire was almost released straight to DVD.",
    "Heath Ledger applied his own Joker makeup for The Dark Knight.",
    "The T-Rex roar in Jurassic Park was made using multiple animal sounds.",
    "The first full-length computer-animated film was Toy Story.",
    "No Country for Old Men has no music — pure tension!",
    "The Hulk was originally grey — color issues in printing turned him green.",
    "Robert Downey Jr. snacked constantly on Avengers set — he even ate during takes.",
    "Gone with the Wind was the first color film to win Best Picture.",
    "The word 'zombie' is never said in Night of the Living Dead.",
    "Godzilla's roar was made using a leather glove and a contrabass."
  ];

  const [fact, setFact] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * movieFacts.length);
    setFact(movieFacts[randomIndex]);
  }, []);

  return (
  <div className="coolfacts">
    <div className="bg-gray-900 text-white p-6 rounded-xl max-w-2xl mx-auto shadow-lg border border-white">

<div className="flex items-center gap-3 mb-4">
  <FaFilm className="text-yellow-400 text-2xl" />
  <h2 className="text-xl font-bold text-gradient">Cool Movie Fact</h2>
</div>
<p className="text-lg leading-relaxed">{fact}</p>
</div>
  </div>
  );
};

export default CoolFacts;
