import React, { useEffect, useMemo, useRef } from 'react';
import Handlebars from 'handlebars';
import useHandlebars from 'hooks/useHandlebars';
import marked from 'marked';
import HtmlToReact from 'html-to-react';
import { fetchSuggestedLabels, upsertLabelMutation, deleteLabelMutation, setShowLoginModal } from '../../services/study/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { fetchIslandConfig, fetchSearchPageOpenCrowdAggBuckets, fetchSearchPageOpenAggBuckets, fetchSearchPageAggBuckets } from 'services/search/actions'
import useUrlParams from 'utils/UrlParamsProvider';
import LoginModal from 'components/LoginModal';
import { uniq } from 'ramda';
import { FieldDisplay, FilterKind } from '../../services/site/model/InputTypes';
import { forEach } from 'remeda';

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

const MailMergeView = (props: Props) => {
  let aggIslands: any[] = [];

  useHandlebars();
  const dispatch = useDispatch();
  const showLoginModal = useSelector((state: RootState) => state.study.showLoginModal);
  const data = useSelector((state: RootState) => state.search.searchResults);
  const isFetchingAggBuckets = useSelector((state: RootState) => state.search.isFetchingAggBuckets);
  const isFetchingCrowdAggBuckets = useSelector((state: RootState) => state.search.isFetchingCrowdAggBuckets);
  const isFetchingStudy = useSelector((state: RootState) => state.study.isFetchingStudy);
  const isUpdatingParams = useSelector((state: RootState) => state.search.isUpdatingParams);
  const searchHash = useSelector((state: RootState ) => state.search.searchHash );
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
  const wfIslandsCurrent = useRef({
    currentWFIsalnds: [] as any[]
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
        if (node.name == "wfagg") {
          wfIslandsCurrent.current.currentWFIsalnds = [...wfIslandsCurrent.current.currentWFIsalnds, node.attribs]
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
  }, [dispatch]);

  useEffect(() => {
    // Duplicate code// Refactor // IslandsAggChild is other file
    let uniqueAggIds = uniq(aggIslandsCurrent.current.currentAggIsalnds); 
    let aggArray: any[] = [];
    let aggIdArray: any[] = [];
    let aggBucketsWanted: any[] = [];
    let aggSortArray: any[] = [];
    let crowdAggArray: any[] = [];
    let crowdAggIdArray: any[] = [];
    let crowdBucketsWanted: any[] = [];
    let crowdAggSortArray: any[] = [];

    islandConfig && uniqueAggIds.map((agg) => {
      if (islandConfig[agg.id]?.defaultToOpen == true) {
        let sort = {
          id: islandConfig[agg.id].order.sortKind,
          desc: islandConfig[agg.id].order.desc
        };

        islandConfig[agg.id].aggKind == 'crowdAggs' && crowdAggArray.push(islandConfig[agg.id].name);
        islandConfig[agg.id].aggKind == 'crowdAggs' && crowdAggIdArray.push({ id: agg.id,  name :islandConfig[agg.id].name  });
        islandConfig[agg.id].aggKind == 'crowdAggs' && crowdBucketsWanted.push(islandConfig[agg.id].visibleOptions);
        islandConfig[agg.id].aggKind == 'crowdAggs' && crowdAggSortArray.push(sort);
        islandConfig[agg.id].aggKind == 'aggs' && aggArray.push(islandConfig[agg.id].name);
        islandConfig[agg.id].aggKind == 'aggs' && aggIdArray.push({ id: agg.id, name :islandConfig[agg.id].name });
        islandConfig[agg.id].aggKind == 'aggs' && aggBucketsWanted.push(islandConfig[agg.id].visibleOptions);
        islandConfig[agg.id].aggKind == 'aggs' && aggSortArray.push(sort);
      }
    });


    if (searchParams && crowdAggArray.length !== 0 ||  searchParams && aggArray.length !== 0) {


      // const variables = {
      //   ...searchParams.searchParams,
      //   url: params.sv,
      //   configType: 'presearch',
      //   returnAll: false,
      //   agg: aggArray,
      //   crowdAgg: crowdAggArray,
      //   aggOptionsSort: aggSortArray,
      //   crowdAggOptionsSort: crowdAggSortArray,
      //   pageSize: 100,
      //   page: 1,
      //   q: searchParams.searchParams.q,
      //   aggBucketsWanted: aggBucketsWanted,
      //   crowdBucketsWanted: crowdBucketsWanted

      // };
      crowdAggArray.forEach((agg, i)=>{

      const variables = {
        ...searchParams.searchParams,
        url: params.sv,
        configType: 'presearch',
        returnAll: false,
        agg: `fm_${agg}`,
        // crowdAgg: crowdAggArray,
        // aggOptionsSort: aggSortArray,
        aggOptionsSort: crowdAggSortArray[i],
        pageSize: 100,
        page: 1,
        q: searchParams.searchParams.q,
        aggBucketsWanted: crowdBucketsWanted[i]
        // crowdBucketsWanted: 
        
      };

      let shouldNotDispatch = isFetchingCrowdAggBuckets || isFetchingAggBuckets || isFetchingStudy || isUpdatingParams
      // !shouldNotDispatch && 
      dispatch(fetchSearchPageAggBuckets(variables, crowdAggIdArray[i].id ))
      });
      aggArray.forEach((agg, i)=>{

      const variables = {
        ...searchParams.searchParams,
        url: params.sv,
        configType: 'presearch',
        returnAll: false,
        agg: agg,
        // crowdAgg: crowdAggArray,
        aggOptionsSort: aggSortArray[i],
        // crowdAggOptionsSort: crowdAggSortArray[i],
        pageSize: 100,
        page: 1,
        q: searchParams.searchParams.q,
        aggBucketsWanted: aggBucketsWanted[i]
        // crowdBucketsWanted: 
        
      };

      let shouldNotDispatch = isFetchingCrowdAggBuckets || isFetchingAggBuckets || isFetchingStudy || isUpdatingParams
      // !shouldNotDispatch && 
      dispatch(fetchSearchPageAggBuckets(variables, aggIdArray[i].id ))
      });
    }

  }, [dispatch, islandConfig, searchHash, searchParams])

  useEffect(()=>{
    let uniqueWFIds = uniq(wfIslandsCurrent.current.currentWFIsalnds); 
    let wfLabels: any[] = [];

    islandConfig && uniqueWFIds.map((WF) => {
      if (islandConfig[WF.id]?.defaultToOpen == true) {
        islandConfig[WF.id] && wfLabels.push(islandConfig[WF.id].name);
      }
    })
  
    if(wfLabels){
      //@ts-ignore
      wfLabels[0] && dispatch(fetchSuggestedLabels(props.context?.nct_id, wfLabels));
      
    }

    
  }, [dispatch, islandConfig])

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

export default React.memo(MailMergeView)