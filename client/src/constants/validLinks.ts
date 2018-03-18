// LINK TYPE

export interface CloakSettings {
    requireDevMode?: boolean;
    requireLogin?: boolean;
    requireAdminRights?: boolean;
}

interface CharacterSettings {
    name: string;
    value: boolean;
}

const mapCharacterToSettingMap: Readonly<{
    [key: string]: Readonly<CharacterSettings>
}> = {
    d: { name: 'requireDevMode', value: true },
    x: { name: 'requireLogin', value: false },
    l: { name: 'requireLogin', value: true },
    a: { name: 'requireAdminRights', value: true },
};

const prepareSettings = (semantics: string): CloakSettings => {
    const settings: CloakSettings = {
        requireDevMode: false,
        requireLogin: false,
        requireAdminRights: false,
    };

    semantics.split(',').forEach((character) => {
        const characterSetting = mapCharacterToSettingMap[character];
        if (characterSetting) {
            const { name, value } = characterSetting;
            settings[name] = value;
        }
    });
    return settings;
};

// COMMON LINK COMBINATION

// List with no links
const noLinks = {};

// List of all links
const allLinks: {
    [key: string]: CloakSettings,
} = {
    workspace: prepareSettings('l'),
    login: prepareSettings('x'),
};

// LINKS IN PAGES

const linksInViews: {
    [key: string]: { [k: string]: CloakSettings };
} = {
    login: noLinks,
    workspace: allLinks,
    notFound: allLinks,
};

export default linksInViews;
