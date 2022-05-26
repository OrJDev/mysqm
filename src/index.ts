import Client from "./classes/Client"

// @types
import type IConfig from "./types/Config";
import type IResults from "./types/Results";
import IListener, {
    ICallBack,
    IEvents
} from "./types/Listener"
import IQuery, { IQueryType, IElementType } from "./types/Query"
import IFields, { IOptionalFields } from "./types/Fields";
export {
    Client,
    IConfig,
    IResults,
    IListener,
    ICallBack,
    IEvents,
    IQuery,
    IQueryType,
    IFields,
    IOptionalFields,
    IElementType
}

export default { Client };