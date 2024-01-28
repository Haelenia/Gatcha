/***************************************************** 
 *    HSR
 ****************************************************/

// TRE : taux de rechargement d'énergie, CAE: chance d'appliquer les effets, RAE: Résistance aux effets
export const HSR_ATTRIBUTES = ['TC', 'DC', 'PV','PV%','Vitesse','Rupture','Foudre','Feu','Vent','Physique','Glace', 'Quantique', 'Imaginaire', 'TRE', 'DEF%', 'DEF', 'CAE', 'Soin', 'ATQ', 'ATQ%', 'RAE' ]

export const HSR_EQUIPMENT = [
    { key: 'head', label: 'Tête' },
    { key: 'hand', label: 'Gants' },
    { key: 'torse', label: 'Torse' },
    { key: 'botte', label: 'Bottes' },
    { key: 'orbe', label: 'Sphère planaire' },
    { key: 'chaine', label: 'Corde de liaison' }
]

export const HSR_ROLE = ['Abondance', 'Erudition', 'Chasse', 'Nihilité', 'Harmonie', 'Destruction', 'Préservation']

export const HSR_ELEMENT = ['Foudre', 'Feu', 'Vent', 'Physique', 'Glace', 'Quantique', 'Imaginaire']


/***************************************************** 
 *    Genshin
 ****************************************************/

export const GENSHIN_ATTRIBUTES = ['TC', 'DC', 'Hydro', 'Pyro', 'Geo', 'Cryo','Electro','Anemo','PV','PV%','DEF','DEF%','RE', 'ME', 'Dendro', 'ATQ', 'ATQ%']

export const GENSHIN_EQUIPMENT = [
    { key: 'fleur', label: 'Fleur' },
    { key: 'plume', label: 'Plume' },
    { key: 'sablier', label: 'Sablier' },
    { key: 'coupe', label: 'Coupe' },
    { key: 'couronne', label: 'Diadème' },
]

export const GENSHIN_WEAPON = [
    { key: '2hSword', label: 'Epée a 2 mains' },
    { key: 'spear', label: 'Lance' },
    { key: 'bow', label: 'Arc'},
    { key: '1hSword', label: 'Epée a 1 main'},
    { key: 'catalyst', label: 'Catalyseur'}
]

export const GENSHIN_ELEMENT = ['Hydro', 'Pyro', 'Geo', 'Cryo','Electro','Anemo', 'Dendro']

export const GENSHIN_DJ_TYPE= [
    { key: 'artefact', label: 'Artefact' },
    { key: 'aptitude', label: 'Matérieux d\'élévation d\'aptitude' },
    { key: 'weapon', label: 'Matérieux d\'élévation d\'arme'}
]

export const MATERIALS = [
    { key: '', label: 'Méka horlogoïdes', type: 'classic'},
    { key: '', label: 'Méka horlogoïdes', type: 'boss'}
]

// Compétence // Ultime // Talent // Ataque normale

// Compétence // Ultime // Attaque normale