import React, { useEffect, useMemo, useRef } from 'react';
import Handlebars from 'handlebars';
import useHandlebars from 'hooks/useHandlebars';
import marked from 'marked';
import HtmlToReact from 'html-to-react';
import { setShowLoginModal } from 'services/study/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { fetchIslandConfig, fetchSearchPageOpenCrowdAggBuckets, fetchSearchPageOpenAggBuckets } from 'services/search/actions'
import useUrlParams from 'utils/UrlParamsProvider';
import LoginModal from 'components/LoginModal';
import { uniq } from 'ramda';
import { FieldDisplay, FilterKind } from '../../services/site/model/InputTypes';

export type IslandConstructor = (
  attributes: Record<string, string>,
  context?: object,
  parent?: any
) => JSX.Element;

export interface Props {
  template: string;
  context?: object;
  style?: object;
  islands?: Record<string, IslandConstructor>;
  refetchQuery?: any;
  pageType?: any;
}
const defaultStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'left',
  flexGrow: 1,

  padding: '4px',
  overflow: 'auto',
  background: '#ffffff',
};

function compileTemplate(template: string) {
  try {
    return Handlebars.compile(template);
  } catch (e) {
    const errMsg = `Template error: ${e}`;
    return _ => errMsg;
  }
}
function randomIdentifier() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_'
  const randomChar = () => chars[Math.floor((Math.random() * chars.length))]
  return Array.from({ length: 12 }, randomChar).join('');
}
function applyTemplate(
  template: HandlebarsTemplateDelegate<any>,
  context?: object,
) {
  try {
    context = { ...context, hash: 'hash', siteViewUrl: "siteViewUrl", pageViewUrl: 'pageViewUrl', q: 'q', ALL: 'ALL' }
    //console.log("🚀 ~ context", context);
    return template(context);
  } catch (e) {
    return `#Template apply error:\n   ${e}`;
  }
}

export function microMailMerge(template = '', context?: object | null) {
  if (context && template.indexOf('{{') >= 0) {
    const compiled = compileTemplate(template);
    return applyTemplate(compiled, context);
  }
  return template;
}

export default function MailMergeView(props: Props) {
  let aggIslands: any[] = [];

  useHandlebars();
  const dispatch = useDispatch();
  const showLoginModal = useSelector((state: RootState) => state.study.showLoginModal);
  const data = useSelector((state: RootState) => state.search.searchResults);

  const searchParams = data?.data?.searchParams;
  const params = useUrlParams();

  const compiled = useMemo(() => compileTemplate(marked(props.template)), [
    props.template,
  ]);
  const raw = useMemo(() => applyTemplate(compiled, props.context), [
    compiled,
    props.context,
  ]);
  const aggIslandsCurrent = useRef({
    currentAggIsalnds: [] as any[]
  })

  const style = props.style
    ? { ...defaultStyle, ...props.style }
    : defaultStyle;

  const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
  const islandKeys = new Set(Object.keys(props.islands || {}));
  var instructions = [
    {
      shouldProcessNode: node => islandKeys.has(node.name),
      processNode: (node, children) => {
        if (node.name == "agg") {
          aggIslandsCurrent.current.currentAggIsalnds = [...aggIslandsCurrent.current.currentAggIsalnds, node.attribs]
        }
        const create = props.islands?.[node.name];
        return (
          <div
            className="mail-merge-island"
            key={node.attribs['key'] + randomIdentifier() || node.name}>
            {create?.(node.attribs, props.context, children)}
          </div>
        );
      },
    },
    {
      shouldProcessNode: () => true,
      processNode: processNodeDefinitions.processDefaultNode,
    },
  ];

  const islandConfig = useSelector((state: RootState) => state.search.islandConfig);


  useEffect(() => {
    !islandConfig && dispatch(fetchIslandConfig());
  }, [dispatch])
  useEffect(() => {
    let uniqueIds = uniq(aggIslandsCurrent.current.currentAggIsalnds);
    let aggArray: any[] = [];
    let aggIdArray: any[] = [];
    let aggBucketsWanted: any[] = [];
    let aggSortArray: any[] = [];
    let crowdAggArray: any[] = [];
    let crowdAggIdArray: any[] = [];
    let crowdBucketsWanted: any[] = [];
    let crowdAggSortArray: any[] = [];

    islandConfig && uniqueIds.map((agg) => {
      if (islandConfig[agg.id]?.defaultToOpen == true) {
        let sort = {
          id: islandConfig[agg.id].order.sortKind,
          desc: islandConfig[agg.id].order.desc
        };

        islandConfig[agg.id].aggKind == 'crowdAggs' && crowdAggArray.push(islandConfig[agg.id].name);
        islandConfig[agg.id].aggKind == 'crowdAggs' && crowdAggIdArray.push({ id: agg.id, name: islandConfig[agg.id].name });
        islandConfig[agg.id].aggKind == 'crowdAggs' && crowdBucketsWanted.push(islandConfig[agg.id].visibleOptions);
        islandConfig[agg.id].aggKind == 'crowdAggs' && crowdAggSortArray.push(sort);
        islandConfig[agg.id].aggKind == 'aggs' && aggArray.push(islandConfig[agg.id].name);
        islandConfig[agg.id].aggKind == 'aggs' && aggIdArray.push({ id: agg.id, name: islandConfig[agg.id].name });
        islandConfig[agg.id].aggKind == 'aggs' && aggBucketsWanted.push(islandConfig[agg.id].visibleOptions);
        islandConfig[agg.id].aggKind == 'aggs' && aggSortArray.push(sort);
      }
    }, [dispatch])


    if (crowdAggArray.length !== 0) {


      const variables = {
        ...searchParams.searchParams,
        url: params.sv,
        configType: 'presearch',
        returnAll: false,
        agg: crowdAggArray,
        aggOptionsSort: crowdAggSortArray,
        pageSize: 100,
        page: 1,
        q: searchParams.searchParams.q,
        bucketsWanted: crowdBucketsWanted,
      };
      variables.agg[0] && dispatch(fetchSearchPageOpenCrowdAggBuckets(variables, crowdAggIdArray))
    }
    if (aggArray.length !== 0) {

      const variables2 = {
        ...searchParams.searchParams,
        url: params.sv,
        configType: 'presearch',
        returnAll: false,
        agg: aggArray,
        aggOptionsSort: aggSortArray,
        pageSize: 100,
        page: 1,
        q: searchParams.searchParams.q,
        bucketsWanted: aggBucketsWanted
      };
      variables2.agg[0] && dispatch(fetchSearchPageOpenAggBuckets(variables2, aggIdArray))
    }

  }, [dispatch, islandConfig, searchParams])

  const parser = new HtmlToReact.Parser();
  const reactElement = parser.parseWithInstructions(
    raw,
    () => true,
    instructions
  );
  return (
    <div className="mail-merge" style={style}>
      <LoginModal
        show={showLoginModal}
        cancel={() => dispatch(setShowLoginModal(false))}
      />
      {reactElement}
    </div>
  );
}
