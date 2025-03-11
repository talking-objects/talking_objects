export const GETKIRBYURL = () => {
    const KIRBYURL = {
        u1: `page("objects").children`,
        u2: `page("objects").children.filterBy('intendedTemplate', '==', 'knowledge')`,
        u3: `page("team")`
    }
}

export const TOA_CORETHEME_CATEGORY = {
    knowledge: "Knowledge",
    resitution: "Restitution / Reclaimation",
    identity: "Identity",
    artisticreflections: "Artistic Reflection",
    memory: "Memory & the Imaginary",
}


export const TOA_COLORS = {
    'orange': '#FF5B1C',
    'yellow': '#FEA30C',
    'violet': '#AC05F1',
    'red': '#800020',
    'blue': '#84A6FF',
    'black': '#1D0C01'
}
// Coretheme Label (using : playground)
export const TOA_CORETHEME_LABEL = {
    'knowledge': {
        color: '#84A6FF',
        name: 'Knowledge'
    },
    'resitution': {
        color: '#FF5B1C',
        name: 'Restitution / Reclaimation'
    },
    'identity': {
        color: '#AC05F1',
        name: 'Identity'
    },
    'artisticreflections': {
        color: '#800020',
        name: 'Artistic Reflection'
    },
    'memory': {
        color: '#FEA30C',
        name: 'Memory & the Imaginary'
    },
   
}
export const VAILDSLUGS = ['knowledge', 'resitution', 'identity', 'memory-the-imaginary', 'artistic-reflections'];



export const BUTTONLIST = [
    {
        name: "Knowledge",
        slug: "knowledge",
        id: 0,
        color: "#84A6FF"
    },
    {
        name: "Restitution and Reclamation",
        slug: "resitution",
        id: 1,
        color: "#FF5B1C"
    },
    {
        name: "Identity",
        slug: "identity",
        id: 2,
        color: "#AC05F1"
    },
    {
        name: "Memory and the Imaginary",
        slug: "memory-the-imaginary",
        id: 3,
        color: "#FEA30C"
    },
    {
        name: "Artistic Reflections",
        slug: "artistic-reflections",
        id: 4,
        color: "#800020"
    },
]

export const DRAGANIMATION_CORETHEMELIST = [
    {
        name: "Knowledge",
        slug: "knowledge",
        id: 0,
        color: "#84A6FF"
    },
    {
        name: "Restitution and Reclamation",
        slug: "resitution",
        id: 1,
        color: "#FF5B1C"
    },
    {
        name: "Identity",
        slug: "identity",
        id: 2,
        color: "#AC05F1"
    },
    {
        name: "Memory and the Imaginary",
        slug: "memory",
        id: 3,
        color: "#FEA30C"
    },
    {
        name: "Artistic Reflections",
        slug: "artisticreflections",
        id: 4,
        color: "#800020"
    },
]