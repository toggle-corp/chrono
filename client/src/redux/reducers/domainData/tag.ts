import update from '../../../vendor/react-store/utils/immutable-update';

import {
    DomainData,
    ReducerGroup,
    Tag,
} from '../../interface';

// ACTION-TYPE

export const enum TAGS_ACTION {
    setUserTags = 'domainData/TAG/SET_USER_TAGS',
    setTag = 'domainData/TAG/SET_TAG',
}

// ACTION-CREATOR

export const setTagsAction = (tags:  Tag[]) => ({
    tags,
    type: TAGS_ACTION.setUserTags,
});

export const setTagAction = (tag: Tag) => ({
    tag,
    type: TAGS_ACTION.setTag,
});

// REDUCER

const setUserTags = (state: DomainData, action: { tags: Tag[] }) => {
    const { tags } = action;
    const settings = {
        tags: { $autoArray: {
            $set: tags,
        } },
    };
    return update(state, settings);
};

const setTag = (state: DomainData, action: { tag: Tag }) => {
    const { tag } = action;
    const { tags } = state;
    const tagIndex = tags.findIndex(t => t.id === tag.id);
    const settings = {
        tags: { $autoArray: {
            $if: [
                tagIndex === -1,
                { $push: [tag] },
                { $splice: [[tagIndex, 1, tag]] },
            ],
        } },
    };
    return update(state, settings);
};

const reducer: ReducerGroup<DomainData> = {
    [TAGS_ACTION.setUserTags]: setUserTags,
    [TAGS_ACTION.setTag]: setTag,
};

export default reducer;
