/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
/** The role the character plays in the media */
export type CharacterRole =
  /** A background character in the media */
  | 'BACKGROUND'
  /** A primary character role in the media */
  | 'MAIN'
  /** A supporting character role in the media */
  | 'SUPPORTING';

/** Date object that allows for incomplete date values (fuzzy) */
export type FuzzyDateInput = {
  /** Numeric Day (24) */
  day?: number | null | undefined;
  /** Numeric Month (3) */
  month?: number | null | undefined;
  /** Numeric Year (2017) */
  year?: number | null | undefined;
};

/** The format the media was released in */
export type MediaFormat =
  /** Professionally published manga with more than one chapter */
  | 'MANGA'
  /** Anime movies with a theatrical release */
  | 'MOVIE'
  /** Short anime released as a music video */
  | 'MUSIC'
  /** Written books released as a series of light novels */
  | 'NOVEL'
  /** (Original Net Animation) Anime that have been originally released online or are only available through streaming services. */
  | 'ONA'
  /** Manga with just one chapter */
  | 'ONE_SHOT'
  /** (Original Video Animation) Anime that have been released directly on DVD/Blu-ray without originally going through a theatrical release or television broadcast */
  | 'OVA'
  /** Special episodes that have been included in DVD/Blu-ray releases, picture dramas, pilots, etc */
  | 'SPECIAL'
  /** Anime broadcast on television */
  | 'TV'
  /** Anime which are under 15 minutes in length and broadcast on television */
  | 'TV_SHORT';

/** Media list watching/reading status enum. */
export type MediaListStatus =
  /** Finished watching/reading */
  | 'COMPLETED'
  /** Currently watching/reading */
  | 'CURRENT'
  /** Stopped watching/reading before completing */
  | 'DROPPED'
  /** Paused watching/reading */
  | 'PAUSED'
  /** Planning to watch/read */
  | 'PLANNING'
  /** Re-watching/reading */
  | 'REPEATING';

/** Type of relation media has to its parent. */
export type MediaRelation =
  /** An adaption of this media into a different format */
  | 'ADAPTATION'
  /** An alternative version of the same media */
  | 'ALTERNATIVE'
  /** Shares at least 1 character */
  | 'CHARACTER'
  /** Version 2 only. */
  | 'COMPILATION'
  /** Version 2 only. */
  | 'CONTAINS'
  /** Other */
  | 'OTHER'
  /** The media a side story is from */
  | 'PARENT'
  /** Released before the relation */
  | 'PREQUEL'
  /** Version 3 only. The media is set in the same universe as another media */
  | 'SAME_UNIVERSE'
  /** Released after the relation */
  | 'SEQUEL'
  /** A side story of the parent media */
  | 'SIDE_STORY'
  /** Version 2 only. The source material the media was adapted from */
  | 'SOURCE'
  /** An alternative version of the media with a different primary focus */
  | 'SPIN_OFF'
  /** A shortened and summarized version */
  | 'SUMMARY';

export type MediaSeason =
  /** Predominantly started airing between October and November */
  | 'FALL'
  /** Predominantly started airing between April and June */
  | 'SPRING'
  /** Predominantly started airing between July and September */
  | 'SUMMER'
  /** Predominantly started airing between January and March */
  | 'WINTER';

/** Media sort enums */
export type MediaSort =
  | 'CHAPTERS'
  | 'CHAPTERS_DESC'
  | 'DURATION'
  | 'DURATION_DESC'
  | 'END_DATE'
  | 'END_DATE_DESC'
  | 'EPISODES'
  | 'EPISODES_DESC'
  | 'FAVOURITES'
  | 'FAVOURITES_DESC'
  | 'FORMAT'
  | 'FORMAT_DESC'
  | 'ID'
  | 'ID_DESC'
  | 'POPULARITY'
  | 'POPULARITY_DESC'
  | 'SCORE'
  | 'SCORE_DESC'
  | 'SEARCH_MATCH'
  | 'START_DATE'
  | 'START_DATE_DESC'
  | 'STATUS'
  | 'STATUS_DESC'
  | 'TITLE_ENGLISH'
  | 'TITLE_ENGLISH_DESC'
  | 'TITLE_NATIVE'
  | 'TITLE_NATIVE_DESC'
  | 'TITLE_ROMAJI'
  | 'TITLE_ROMAJI_DESC'
  | 'TRENDING'
  | 'TRENDING_DESC'
  | 'TYPE'
  | 'TYPE_DESC'
  | 'UPDATED_AT'
  | 'UPDATED_AT_DESC'
  | 'VOLUMES'
  | 'VOLUMES_DESC';

/** Source type the media was adapted from */
export type MediaSource =
  /** Version 2+ only. Japanese Anime */
  | 'ANIME'
  /** Version 3 only. Comics excluding manga */
  | 'COMIC'
  /** Version 2+ only. Self-published works */
  | 'DOUJINSHI'
  /** Version 3 only. Games excluding video games */
  | 'GAME'
  /** Written work published in volumes */
  | 'LIGHT_NOVEL'
  /** Version 3 only. Live action media such as movies or TV show */
  | 'LIVE_ACTION'
  /** Asian comic book */
  | 'MANGA'
  /** Version 3 only. Multimedia project */
  | 'MULTIMEDIA_PROJECT'
  /** Version 2+ only. Written works not published in volumes */
  | 'NOVEL'
  /** An original production not based of another work */
  | 'ORIGINAL'
  /** Other */
  | 'OTHER'
  /** Version 3 only. Picture book */
  | 'PICTURE_BOOK'
  /** Video game */
  | 'VIDEO_GAME'
  /** Video game driven primary by text and narrative */
  | 'VISUAL_NOVEL'
  /** Version 3 only. Written works published online */
  | 'WEB_NOVEL';

/** The current releasing status of the media */
export type MediaStatus =
  /** Ended before the work could be finished */
  | 'CANCELLED'
  /** Has completed and is no longer being released */
  | 'FINISHED'
  /** Version 2 only. Is currently paused from releasing and will resume at a later date */
  | 'HIATUS'
  /** To be released at a later date */
  | 'NOT_YET_RELEASED'
  /** Currently releasing */
  | 'RELEASING';

/** Media type enum, anime or manga. */
export type MediaType =
  /** Japanese Anime */
  | 'ANIME'
  /** Asian comic */
  | 'MANGA';

/** Media list scoring type */
export type ScoreFormat =
  /** An integer from 0-3. Should be represented in Smileys. 0 => No Score, 1 => :(, 2 => :|, 3 => :) */
  | 'POINT_3'
  /** An integer from 0-5. Should be represented in Stars */
  | 'POINT_5'
  /** An integer from 0-10 */
  | 'POINT_10'
  /** A float from 0-10 with 1 decimal place */
  | 'POINT_10_DECIMAL'
  /** An integer from 0-100 */
  | 'POINT_100';

export type MediaCoverCardFragment = { id: number, genres: Array<string | null> | null, episodes: number | null, averageScore: number | null, format: MediaFormat | null, season: MediaSeason | null, seasonYear: number | null, title: { userPreferred: string | null } | null, coverImage: { large: string | null, color: string | null } | null, studios: { nodes: Array<{ id: number, name: string } | null> | null } | null, startDate: { year: number | null, month: number | null, day: number | null } | null };

export type MediaListCollectionQueryVariables = Exact<{
  userId?: number | null | undefined;
}>;


export type MediaListCollectionQuery = { MediaListCollection: { lists: Array<{ name: string | null, status: MediaListStatus | null, entries: Array<{ id: number, status: MediaListStatus | null, progress: number | null, media: { id: number, format: MediaFormat | null, episodes: number | null, averageScore: number | null, title: { userPreferred: string | null } | null, coverImage: { large: string | null } | null, nextAiringEpisode: { airingAt: number, episode: number } | null } | null } | null> | null } | null> | null } | null };

export type SaveMediaListEntryMutationVariables = Exact<{
  id?: number | null | undefined;
  status?: MediaListStatus | null | undefined;
  progress?: number | null | undefined;
}>;


export type SaveMediaListEntryMutation = { SaveMediaListEntry: { id: number, status: MediaListStatus | null, progress: number | null } | null };

export type AnimeListEntryFieldsFragment = { id: number, status: MediaListStatus | null, progress: number | null, score: number | null, repeat: number | null, notes: string | null, private: boolean | null, startedAt: { year: number | null, month: number | null, day: number | null } | null, completedAt: { year: number | null, month: number | null, day: number | null } | null };

export type AnimeListEntryQueryVariables = Exact<{
  mediaId?: number | null | undefined;
}>;


export type AnimeListEntryQuery = { Viewer: { mediaListOptions: { scoreFormat: ScoreFormat | null } | null } | null, Media: { mediaListEntry: { id: number, status: MediaListStatus | null, progress: number | null, score: number | null, repeat: number | null, notes: string | null, private: boolean | null, startedAt: { year: number | null, month: number | null, day: number | null } | null, completedAt: { year: number | null, month: number | null, day: number | null } | null } | null } | null };

export type SaveAnimeListEntryMutationVariables = Exact<{
  mediaId?: number | null | undefined;
  status?: MediaListStatus | null | undefined;
  progress?: number | null | undefined;
  score?: number | null | undefined;
  repeat?: number | null | undefined;
  notes?: string | null | undefined;
  private?: boolean | null | undefined;
  startedAt?: FuzzyDateInput | null | undefined;
  completedAt?: FuzzyDateInput | null | undefined;
}>;


export type SaveAnimeListEntryMutation = { SaveMediaListEntry: { id: number, status: MediaListStatus | null, progress: number | null, score: number | null, repeat: number | null, notes: string | null, private: boolean | null, startedAt: { year: number | null, month: number | null, day: number | null } | null, completedAt: { year: number | null, month: number | null, day: number | null } | null } | null };

export type DeleteAnimeListEntryMutationVariables = Exact<{
  id?: number | null | undefined;
}>;


export type DeleteAnimeListEntryMutation = { DeleteMediaListEntry: { deleted: boolean | null } | null };

export type AnimeCharacterEdgeFragment = { role: CharacterRole | null, node: { id: number, name: { full: string | null } | null, image: { medium: string | null } | null } | null, voiceActorRoles: Array<{ roleNotes: string | null, voiceActor: { id: number, name: { full: string | null } | null, image: { medium: string | null } | null } | null } | null> | null };

export type AnimeStaffEdgeFragment = { id: number | null, role: string | null, node: { id: number, name: { full: string | null } | null, image: { medium: string | null } | null } | null };

export type AnimeQueryVariables = Exact<{
  id?: number | null | undefined;
}>;


export type AnimeQuery = { Media: { id: number, bannerImage: string | null, synonyms: Array<string | null> | null, genres: Array<string | null> | null, episodes: number | null, duration: number | null, averageScore: number | null, meanScore: number | null, popularity: number | null, favourites: number | null, format: MediaFormat | null, status: MediaStatus | null, source: MediaSource | null, season: MediaSeason | null, seasonYear: number | null, description: string | null, title: { userPreferred: string | null, english: string | null, native: string | null } | null, coverImage: { large: string | null, color: string | null } | null, startDate: { year: number | null, month: number | null, day: number | null } | null, endDate: { year: number | null, month: number | null, day: number | null } | null, studios: { edges: Array<{ isMain: boolean, node: { id: number, name: string } | null } | null> | null } | null, characters: { edges: Array<{ role: CharacterRole | null, node: { id: number, name: { full: string | null } | null, image: { medium: string | null } | null } | null, voiceActorRoles: Array<{ roleNotes: string | null, voiceActor: { id: number, name: { full: string | null } | null, image: { medium: string | null } | null } | null } | null> | null } | null> | null, pageInfo: { currentPage: number | null, hasNextPage: boolean | null } | null } | null, staff: { edges: Array<{ id: number | null, role: string | null, node: { id: number, name: { full: string | null } | null, image: { medium: string | null } | null } | null } | null> | null, pageInfo: { currentPage: number | null, hasNextPage: boolean | null } | null } | null, tags: Array<{ id: number, name: string, rank: number | null, isMediaSpoiler: boolean | null } | null> | null, relations: { edges: Array<{ relationType: MediaRelation | null, node: { id: number, format: MediaFormat | null, title: { userPreferred: string | null } | null, coverImage: { large: string | null } | null } | null } | null> | null } | null, recommendations: { edges: Array<{ node: { mediaRecommendation: { id: number, format: MediaFormat | null, averageScore: number | null, favourites: number | null, title: { userPreferred: string | null } | null, coverImage: { large: string | null } | null } | null } | null } | null> | null } | null, externalLinks: Array<{ id: number, site: string, url: string | null, color: string | null, icon: string | null } | null> | null } | null };

export type AnimeCharactersPageQueryVariables = Exact<{
  id?: number | null | undefined;
  page?: number | null | undefined;
}>;


export type AnimeCharactersPageQuery = { Media: { characters: { edges: Array<{ role: CharacterRole | null, node: { id: number, name: { full: string | null } | null, image: { medium: string | null } | null } | null, voiceActorRoles: Array<{ roleNotes: string | null, voiceActor: { id: number, name: { full: string | null } | null, image: { medium: string | null } | null } | null } | null> | null } | null> | null, pageInfo: { currentPage: number | null, hasNextPage: boolean | null } | null } | null } | null };

export type AnimeStaffPageQueryVariables = Exact<{
  id?: number | null | undefined;
  page?: number | null | undefined;
}>;


export type AnimeStaffPageQuery = { Media: { staff: { edges: Array<{ id: number | null, role: string | null, node: { id: number, name: { full: string | null } | null, image: { medium: string | null } | null } | null } | null> | null, pageInfo: { currentPage: number | null, hasNextPage: boolean | null } | null } | null } | null };

export type ViewerQueryVariables = Exact<{ [key: string]: never; }>;


export type ViewerQuery = { Viewer: { id: number, name: string, avatar: { medium: string | null } | null, mediaListOptions: { animeList: { sectionOrder: Array<string | null> | null } | null } | null } | null };

export type CharacterQueryVariables = Exact<{
  id?: number | null | undefined;
}>;


export type CharacterQuery = { Character: { id: number, favourites: number | null, name: { full: string | null, native: string | null } | null, image: { large: string | null } | null, media: { edges: Array<{ node: { id: number, type: MediaType | null, title: { userPreferred: string | null } | null, coverImage: { large: string | null } | null } | null, voiceActors: Array<{ id: number, languageV2: string | null, name: { full: string | null } | null, image: { large: string | null } | null } | null> | null } | null> | null } | null } | null };

export type HomeMediaPageQueryVariables = Exact<{
  sort?: Array<MediaSort | null | undefined> | MediaSort | null | undefined;
  season?: MediaSeason | null | undefined;
  seasonYear?: number | null | undefined;
}>;


export type HomeMediaPageQuery = { Page: { media: Array<{ bannerImage: string | null, id: number, genres: Array<string | null> | null, episodes: number | null, averageScore: number | null, format: MediaFormat | null, season: MediaSeason | null, seasonYear: number | null, title: { userPreferred: string | null } | null, coverImage: { large: string | null, color: string | null } | null, studios: { nodes: Array<{ id: number, name: string } | null> | null } | null, startDate: { year: number | null, month: number | null, day: number | null } | null } | null> | null } | null };

export type SearchMediaQueryVariables = Exact<{
  page?: number | null | undefined;
  search?: string | null | undefined;
}>;


export type SearchMediaQuery = { Page: { pageInfo: { currentPage: number | null, hasNextPage: boolean | null } | null, media: Array<{ id: number, genres: Array<string | null> | null, episodes: number | null, averageScore: number | null, format: MediaFormat | null, season: MediaSeason | null, seasonYear: number | null, title: { userPreferred: string | null } | null, coverImage: { large: string | null, color: string | null } | null, studios: { nodes: Array<{ id: number, name: string } | null> | null } | null, startDate: { year: number | null, month: number | null, day: number | null } | null } | null> | null } | null };

export type SeasonalMediaPageQueryVariables = Exact<{
  page?: number | null | undefined;
  season?: MediaSeason | null | undefined;
  seasonYear?: number | null | undefined;
  sort?: Array<MediaSort | null | undefined> | MediaSort | null | undefined;
  isAdult?: boolean | null | undefined;
  onList?: boolean | null | undefined;
}>;


export type SeasonalMediaPageQuery = { Page: { pageInfo: { hasNextPage: boolean | null } | null, media: Array<{ id: number, format: MediaFormat | null, genres: Array<string | null> | null, averageScore: number | null, favourites: number | null, popularity: number | null, title: { userPreferred: string | null } | null, coverImage: { large: string | null, color: string | null } | null, studios: { nodes: Array<{ name: string } | null> | null } | null, mediaListEntry: { id: number, status: MediaListStatus | null } | null } | null> | null } | null };

export type AddToPlanningMutationVariables = Exact<{
  mediaId?: number | null | undefined;
}>;


export type AddToPlanningMutation = { SaveMediaListEntry: { id: number, status: MediaListStatus | null } | null };

export type StaffCharacterEdgeFragment = { id: number | null, role: CharacterRole | null, node: { id: number, name: { full: string | null } | null, image: { large: string | null } | null } | null, media: Array<{ id: number, format: MediaFormat | null, title: { userPreferred: string | null } | null, coverImage: { large: string | null } | null } | null> | null };

export type StaffMediaEdgeFragment = { staffRole: string | null, node: { id: number, title: { userPreferred: string | null } | null, coverImage: { large: string | null } | null, startDate: { year: number | null, month: number | null, day: number | null } | null } | null };

export type StaffQueryVariables = Exact<{
  id?: number | null | undefined;
}>;


export type StaffQuery = { Staff: { id: number, gender: string | null, age: number | null, yearsActive: Array<number | null> | null, description: string | null, favourites: number | null, homeTown: string | null, bloodType: string | null, name: { full: string | null, native: string | null } | null, image: { large: string | null } | null, dateOfBirth: { year: number | null, month: number | null, day: number | null } | null, characters: { edges: Array<{ id: number | null, role: CharacterRole | null, node: { id: number, name: { full: string | null } | null, image: { large: string | null } | null } | null, media: Array<{ id: number, format: MediaFormat | null, title: { userPreferred: string | null } | null, coverImage: { large: string | null } | null } | null> | null } | null> | null, pageInfo: { currentPage: number | null, hasNextPage: boolean | null } | null } | null, staffMedia: { edges: Array<{ staffRole: string | null, node: { id: number, title: { userPreferred: string | null } | null, coverImage: { large: string | null } | null, startDate: { year: number | null, month: number | null, day: number | null } | null } | null } | null> | null, pageInfo: { currentPage: number | null, hasNextPage: boolean | null } | null } | null } | null };

export type StaffCharactersPageQueryVariables = Exact<{
  id?: number | null | undefined;
  page?: number | null | undefined;
}>;


export type StaffCharactersPageQuery = { Staff: { characters: { edges: Array<{ id: number | null, role: CharacterRole | null, node: { id: number, name: { full: string | null } | null, image: { large: string | null } | null } | null, media: Array<{ id: number, format: MediaFormat | null, title: { userPreferred: string | null } | null, coverImage: { large: string | null } | null } | null> | null } | null> | null, pageInfo: { currentPage: number | null, hasNextPage: boolean | null } | null } | null } | null };

export type StaffMediaPageQueryVariables = Exact<{
  id?: number | null | undefined;
  page?: number | null | undefined;
}>;


export type StaffMediaPageQuery = { Staff: { staffMedia: { edges: Array<{ staffRole: string | null, node: { id: number, title: { userPreferred: string | null } | null, coverImage: { large: string | null } | null, startDate: { year: number | null, month: number | null, day: number | null } | null } | null } | null> | null, pageInfo: { currentPage: number | null, hasNextPage: boolean | null } | null } | null } | null };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
export const MediaCoverCardFragmentDoc = new TypedDocumentString(`
    fragment MediaCoverCard on Media {
  id
  title {
    userPreferred
  }
  coverImage {
    large
    color
  }
  genres
  episodes
  averageScore
  format
  studios(isMain: true) {
    nodes {
      id
      name
    }
  }
  season
  seasonYear
  startDate {
    year
    month
    day
  }
}
    `, {"fragmentName":"MediaCoverCard"}) as unknown as TypedDocumentString<MediaCoverCardFragment, unknown>;
export const AnimeListEntryFieldsFragmentDoc = new TypedDocumentString(`
    fragment AnimeListEntryFields on MediaList {
  id
  status
  progress
  score
  repeat
  notes
  private
  startedAt {
    year
    month
    day
  }
  completedAt {
    year
    month
    day
  }
}
    `, {"fragmentName":"AnimeListEntryFields"}) as unknown as TypedDocumentString<AnimeListEntryFieldsFragment, unknown>;
export const AnimeCharacterEdgeFragmentDoc = new TypedDocumentString(`
    fragment AnimeCharacterEdge on CharacterEdge {
  role
  node {
    id
    name {
      full
    }
    image {
      medium
    }
  }
  voiceActorRoles(language: JAPANESE, sort: RELEVANCE) {
    roleNotes
    voiceActor {
      id
      name {
        full
      }
      image {
        medium
      }
    }
  }
}
    `, {"fragmentName":"AnimeCharacterEdge"}) as unknown as TypedDocumentString<AnimeCharacterEdgeFragment, unknown>;
export const AnimeStaffEdgeFragmentDoc = new TypedDocumentString(`
    fragment AnimeStaffEdge on StaffEdge {
  id
  role
  node {
    id
    name {
      full
    }
    image {
      medium
    }
  }
}
    `, {"fragmentName":"AnimeStaffEdge"}) as unknown as TypedDocumentString<AnimeStaffEdgeFragment, unknown>;
export const StaffCharacterEdgeFragmentDoc = new TypedDocumentString(`
    fragment StaffCharacterEdge on CharacterEdge {
  id
  role
  node {
    id
    name {
      full
    }
    image {
      large
    }
  }
  media {
    id
    format
    title {
      userPreferred
    }
    coverImage {
      large
    }
  }
}
    `, {"fragmentName":"StaffCharacterEdge"}) as unknown as TypedDocumentString<StaffCharacterEdgeFragment, unknown>;
export const StaffMediaEdgeFragmentDoc = new TypedDocumentString(`
    fragment StaffMediaEdge on MediaEdge {
  staffRole
  node {
    id
    title {
      userPreferred
    }
    coverImage {
      large
    }
    startDate {
      year
      month
      day
    }
  }
}
    `, {"fragmentName":"StaffMediaEdge"}) as unknown as TypedDocumentString<StaffMediaEdgeFragment, unknown>;
export const MediaListCollectionDocument = new TypedDocumentString(`
    query MediaListCollection($userId: Int) {
  MediaListCollection(userId: $userId, type: ANIME) {
    lists {
      name
      status
      entries {
        id
        status
        progress
        media {
          id
          title {
            userPreferred
          }
          coverImage {
            large
          }
          format
          episodes
          averageScore
          nextAiringEpisode {
            airingAt
            episode
          }
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<MediaListCollectionQuery, MediaListCollectionQueryVariables>;
export const SaveMediaListEntryDocument = new TypedDocumentString(`
    mutation SaveMediaListEntry($id: Int, $status: MediaListStatus, $progress: Int) {
  SaveMediaListEntry(id: $id, status: $status, progress: $progress) {
    id
    status
    progress
  }
}
    `) as unknown as TypedDocumentString<SaveMediaListEntryMutation, SaveMediaListEntryMutationVariables>;
export const AnimeListEntryDocument = new TypedDocumentString(`
    query AnimeListEntry($mediaId: Int) {
  Viewer {
    mediaListOptions {
      scoreFormat
    }
  }
  Media(id: $mediaId, type: ANIME) {
    mediaListEntry {
      ...AnimeListEntryFields
    }
  }
}
    fragment AnimeListEntryFields on MediaList {
  id
  status
  progress
  score
  repeat
  notes
  private
  startedAt {
    year
    month
    day
  }
  completedAt {
    year
    month
    day
  }
}`) as unknown as TypedDocumentString<AnimeListEntryQuery, AnimeListEntryQueryVariables>;
export const SaveAnimeListEntryDocument = new TypedDocumentString(`
    mutation SaveAnimeListEntry($mediaId: Int, $status: MediaListStatus, $progress: Int, $score: Float, $repeat: Int, $notes: String, $private: Boolean, $startedAt: FuzzyDateInput, $completedAt: FuzzyDateInput) {
  SaveMediaListEntry(
    mediaId: $mediaId
    status: $status
    progress: $progress
    score: $score
    repeat: $repeat
    notes: $notes
    private: $private
    startedAt: $startedAt
    completedAt: $completedAt
  ) {
    ...AnimeListEntryFields
  }
}
    fragment AnimeListEntryFields on MediaList {
  id
  status
  progress
  score
  repeat
  notes
  private
  startedAt {
    year
    month
    day
  }
  completedAt {
    year
    month
    day
  }
}`) as unknown as TypedDocumentString<SaveAnimeListEntryMutation, SaveAnimeListEntryMutationVariables>;
export const DeleteAnimeListEntryDocument = new TypedDocumentString(`
    mutation DeleteAnimeListEntry($id: Int) {
  DeleteMediaListEntry(id: $id) {
    deleted
  }
}
    `) as unknown as TypedDocumentString<DeleteAnimeListEntryMutation, DeleteAnimeListEntryMutationVariables>;
export const AnimeDocument = new TypedDocumentString(`
    query Anime($id: Int) {
  Media(id: $id, type: ANIME) {
    id
    title {
      userPreferred
      english
      native
    }
    coverImage {
      large
      color
    }
    bannerImage
    synonyms
    genres
    episodes
    duration
    averageScore
    meanScore
    popularity
    favourites
    format
    status
    source
    season
    seasonYear
    description(asHtml: false)
    startDate {
      year
      month
      day
    }
    endDate {
      year
      month
      day
    }
    studios {
      edges {
        isMain
        node {
          id
          name
        }
      }
    }
    characters(sort: [ROLE, ID], page: 1, perPage: 20) {
      edges {
        ...AnimeCharacterEdge
      }
      pageInfo {
        currentPage
        hasNextPage
      }
    }
    staff(sort: RELEVANCE, page: 1, perPage: 20) {
      edges {
        ...AnimeStaffEdge
      }
      pageInfo {
        currentPage
        hasNextPage
      }
    }
    tags {
      id
      name
      rank
      isMediaSpoiler
    }
    relations {
      edges {
        relationType
        node {
          id
          title {
            userPreferred
          }
          format
          coverImage {
            large
          }
        }
      }
    }
    recommendations(sort: RATING_DESC) {
      edges {
        node {
          mediaRecommendation {
            id
            title {
              userPreferred
            }
            format
            coverImage {
              large
            }
            averageScore
            favourites
          }
        }
      }
    }
    externalLinks {
      id
      site
      url
      color
      icon
    }
  }
}
    fragment AnimeCharacterEdge on CharacterEdge {
  role
  node {
    id
    name {
      full
    }
    image {
      medium
    }
  }
  voiceActorRoles(language: JAPANESE, sort: RELEVANCE) {
    roleNotes
    voiceActor {
      id
      name {
        full
      }
      image {
        medium
      }
    }
  }
}
fragment AnimeStaffEdge on StaffEdge {
  id
  role
  node {
    id
    name {
      full
    }
    image {
      medium
    }
  }
}`) as unknown as TypedDocumentString<AnimeQuery, AnimeQueryVariables>;
export const AnimeCharactersPageDocument = new TypedDocumentString(`
    query AnimeCharactersPage($id: Int, $page: Int) {
  Media(id: $id, type: ANIME) {
    characters(sort: [ROLE, ID], page: $page, perPage: 20) {
      edges {
        ...AnimeCharacterEdge
      }
      pageInfo {
        currentPage
        hasNextPage
      }
    }
  }
}
    fragment AnimeCharacterEdge on CharacterEdge {
  role
  node {
    id
    name {
      full
    }
    image {
      medium
    }
  }
  voiceActorRoles(language: JAPANESE, sort: RELEVANCE) {
    roleNotes
    voiceActor {
      id
      name {
        full
      }
      image {
        medium
      }
    }
  }
}`) as unknown as TypedDocumentString<AnimeCharactersPageQuery, AnimeCharactersPageQueryVariables>;
export const AnimeStaffPageDocument = new TypedDocumentString(`
    query AnimeStaffPage($id: Int, $page: Int) {
  Media(id: $id, type: ANIME) {
    staff(sort: RELEVANCE, page: $page, perPage: 20) {
      edges {
        ...AnimeStaffEdge
      }
      pageInfo {
        currentPage
        hasNextPage
      }
    }
  }
}
    fragment AnimeStaffEdge on StaffEdge {
  id
  role
  node {
    id
    name {
      full
    }
    image {
      medium
    }
  }
}`) as unknown as TypedDocumentString<AnimeStaffPageQuery, AnimeStaffPageQueryVariables>;
export const ViewerDocument = new TypedDocumentString(`
    query Viewer {
  Viewer {
    id
    name
    avatar {
      medium
    }
    mediaListOptions {
      animeList {
        sectionOrder
      }
    }
  }
}
    `) as unknown as TypedDocumentString<ViewerQuery, ViewerQueryVariables>;
export const CharacterDocument = new TypedDocumentString(`
    query Character($id: Int) {
  Character(id: $id) {
    id
    name {
      full
      native
    }
    image {
      large
    }
    favourites
    media(sort: POPULARITY_DESC) {
      edges {
        node {
          id
          type
          title {
            userPreferred
          }
          coverImage {
            large
          }
        }
        voiceActors {
          id
          name {
            full
          }
          image {
            large
          }
          languageV2
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<CharacterQuery, CharacterQueryVariables>;
export const HomeMediaPageDocument = new TypedDocumentString(`
    query HomeMediaPage($sort: [MediaSort], $season: MediaSeason, $seasonYear: Int) {
  Page(page: 1, perPage: 10) {
    media(type: ANIME, sort: $sort, season: $season, seasonYear: $seasonYear) {
      bannerImage
      ...MediaCoverCard
    }
  }
}
    fragment MediaCoverCard on Media {
  id
  title {
    userPreferred
  }
  coverImage {
    large
    color
  }
  genres
  episodes
  averageScore
  format
  studios(isMain: true) {
    nodes {
      id
      name
    }
  }
  season
  seasonYear
  startDate {
    year
    month
    day
  }
}`) as unknown as TypedDocumentString<HomeMediaPageQuery, HomeMediaPageQueryVariables>;
export const SearchMediaDocument = new TypedDocumentString(`
    query SearchMedia($page: Int, $search: String) {
  Page(page: $page, perPage: 40) {
    pageInfo {
      currentPage
      hasNextPage
    }
    media(type: ANIME, search: $search, sort: [POPULARITY_DESC], isAdult: false) {
      ...MediaCoverCard
    }
  }
}
    fragment MediaCoverCard on Media {
  id
  title {
    userPreferred
  }
  coverImage {
    large
    color
  }
  genres
  episodes
  averageScore
  format
  studios(isMain: true) {
    nodes {
      id
      name
    }
  }
  season
  seasonYear
  startDate {
    year
    month
    day
  }
}`) as unknown as TypedDocumentString<SearchMediaQuery, SearchMediaQueryVariables>;
export const SeasonalMediaPageDocument = new TypedDocumentString(`
    query SeasonalMediaPage($page: Int, $season: MediaSeason, $seasonYear: Int, $sort: [MediaSort], $isAdult: Boolean, $onList: Boolean) {
  Page(page: $page, perPage: 50) {
    pageInfo {
      hasNextPage
    }
    media(
      type: ANIME
      season: $season
      seasonYear: $seasonYear
      sort: $sort
      isAdult: $isAdult
      onList: $onList
    ) {
      id
      format
      title {
        userPreferred
      }
      coverImage {
        large
        color
      }
      genres
      averageScore
      favourites
      popularity
      studios(isMain: true) {
        nodes {
          name
        }
      }
      mediaListEntry {
        id
        status
      }
    }
  }
}
    `) as unknown as TypedDocumentString<SeasonalMediaPageQuery, SeasonalMediaPageQueryVariables>;
export const AddToPlanningDocument = new TypedDocumentString(`
    mutation AddToPlanning($mediaId: Int) {
  SaveMediaListEntry(mediaId: $mediaId, status: PLANNING) {
    id
    status
  }
}
    `) as unknown as TypedDocumentString<AddToPlanningMutation, AddToPlanningMutationVariables>;
export const StaffDocument = new TypedDocumentString(`
    query Staff($id: Int) {
  Staff(id: $id) {
    id
    name {
      full
      native
    }
    image {
      large
    }
    gender
    age
    yearsActive
    description(asHtml: true)
    favourites
    homeTown
    bloodType
    dateOfBirth {
      year
      month
      day
    }
    characters(sort: FAVOURITES_DESC, page: 1) {
      edges {
        ...StaffCharacterEdge
      }
      pageInfo {
        currentPage
        hasNextPage
      }
    }
    staffMedia(type: ANIME, sort: START_DATE_DESC, page: 1) {
      edges {
        ...StaffMediaEdge
      }
      pageInfo {
        currentPage
        hasNextPage
      }
    }
  }
}
    fragment StaffCharacterEdge on CharacterEdge {
  id
  role
  node {
    id
    name {
      full
    }
    image {
      large
    }
  }
  media {
    id
    format
    title {
      userPreferred
    }
    coverImage {
      large
    }
  }
}
fragment StaffMediaEdge on MediaEdge {
  staffRole
  node {
    id
    title {
      userPreferred
    }
    coverImage {
      large
    }
    startDate {
      year
      month
      day
    }
  }
}`) as unknown as TypedDocumentString<StaffQuery, StaffQueryVariables>;
export const StaffCharactersPageDocument = new TypedDocumentString(`
    query StaffCharactersPage($id: Int, $page: Int) {
  Staff(id: $id) {
    characters(sort: FAVOURITES_DESC, page: $page) {
      edges {
        ...StaffCharacterEdge
      }
      pageInfo {
        currentPage
        hasNextPage
      }
    }
  }
}
    fragment StaffCharacterEdge on CharacterEdge {
  id
  role
  node {
    id
    name {
      full
    }
    image {
      large
    }
  }
  media {
    id
    format
    title {
      userPreferred
    }
    coverImage {
      large
    }
  }
}`) as unknown as TypedDocumentString<StaffCharactersPageQuery, StaffCharactersPageQueryVariables>;
export const StaffMediaPageDocument = new TypedDocumentString(`
    query StaffMediaPage($id: Int, $page: Int) {
  Staff(id: $id) {
    staffMedia(type: ANIME, sort: START_DATE_DESC, page: $page) {
      edges {
        ...StaffMediaEdge
      }
      pageInfo {
        currentPage
        hasNextPage
      }
    }
  }
}
    fragment StaffMediaEdge on MediaEdge {
  staffRole
  node {
    id
    title {
      userPreferred
    }
    coverImage {
      large
    }
    startDate {
      year
      month
      day
    }
  }
}`) as unknown as TypedDocumentString<StaffMediaPageQuery, StaffMediaPageQueryVariables>;