import React, { useEffect, useState } from 'react';
import MailMerge from './MailMerge';
import { FormControl, DropdownButton, MenuItem } from 'react-bootstrap';
import { getStudyQuery, getSearchQuery, getHasuraStudyQuery } from './MailMergeUtils';
import { commonIslands } from 'containers/Islands/CommonIslands';
import { useHasuraFragment } from './HasuraMMFragment';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHasuraIntrospection } from 'services/introspection/actions';
import { RootState } from 'reducers';
import { introspectionQuery } from 'graphql/utilities';
import { BeatLoader } from 'react-spinners';
import { fetchStudyPage, fetchStudyPageHasura } from 'services/study/actions';


type Mode = 'Study' | 'Search' | 'HasuraStudy';
// return a tuple of the elements that differ with the mode
// query, params, schema

function getClassForMode(mode: Mode) {
    switch (mode) {
        case 'Study':
            return 'Study';
        case 'Search':
            return 'ElasticStudy';
        case 'HasuraStudy':
            return 'ctgov_prod_studies';
    }
}

export default function HasuraTestComponent() {
    const [template, setTemplate] = useState(`
# title: {{brief_title}}
<Expander header="outter">
  <table class="table table-striped table-bordered table-condensed">
    <tbody>
      <tr> <th>NCT ID</th> <td>{{nct_id}}</td> </tr>
      <tr> <th>Overall Status</th> <td>{{overall_status}}</td> </tr>
      <tr> <th>Completion Date</th> <td>{{completion_date}}</td> </tr>
      <tr> <th>Enrollment</th> <td>{{enrollment}}</td> </tr>
      <tr> <th>Source</th> <td>{{source}}</td> </tr>
    </tbody>
  </table>
  <Expander header=details collapsed=true>
    <Groot></Groot>
  </Expander>
</Expander>
`);

    const [template2, setTemplate2] = useState(`
<div style="max-width: 80%; padding-left: 10%;">
<Back></Back>

<Navigation></Navigation>

<h2 style="text-align:center">{{brief_title}}<Reactions></Reactions></h2>

<table class="table table-striped table-bordered table-condensed">
  <tbody>
    <tr> <td>NCT ID</td> <td>{{nct_id}} <A HREF="https://clinicaltrials.gov/ct2/show/{{nctId}}"  target=_blank><img src="https://logo.clearbit.com/nih.gov" title="Open at clinicaltrials.gov" title="Open at clinicaltrials.gov"  width="25"></A> </td> </tr>
    <tr> <td>Overall Status</td> <td>{{overall_status}} (Completion Date: {{completionDate}}) </td></tr>
    <tr> <td>Enrollment {{enrollment_type}}</td> <td>{{enrollment}} </td> </tr>
<tr><td> Conditions</td><td>{{conditions}} </td></tr>
    <tr> <td>Source</td> <td>{{source}}</td> </tr>
    <tr><td>Trial Type</td><td>{{study_type}} </td></tr>
<tr><td> Phase</td><td>{{phase}}</td></tr>
<tr><td> Start Date {{start_date_type}}</td><td>{{start_date}} 
<tr> <td>Trial Last Updated</td> <td>{{last_update_posted_date}}</td> </tr>
 
</td></tr>
  </tbody>
</table>  

### Workflow:
<Workflow name="WF_AliveAndKickn1"></Workflow>

<h3 style="text align:center">Facilities</h3>
<Facility></Facility>

### Wiki
<Wikipage></Wikipage>

### Edits History
<EditsHistory></EditsHistory>

### Reviews
<Reviews></Reviews>

### General Trial Information
### Description
<pre>{{brief_summary}}{{detailed_description}} </pre>
### Eligibility Criteria
<pre>{{eligibility_criteria}}</pre> 

<table class="table table-striped table-bordered table-condensed" class="center">
  <tbody>
    <tr> <td style="min-width:150px">Official Title</td> <td>{{official_title}}</td> </tr>
    <tr> <td>Gender Eligibility</td> <td> {{eligibility_gender}}  
 </td></tr>
<tr> <td>Accepts Healthy Volunteers</td> <td>{{eligibility_healthy_volunteers}} </td></tr>
<tr><td>Expanded Access</td><td>{{has_expanded_access}}</td></tr>
    <tr> <td>FDA-regulated
</td> <td>{{is_fda_regulated}}  
</td> </tr>
<tr> <td>Has a Data Monitoring Committee  
</td> <td>{{has_data_monitoring_committee}}  
</td> </tr>
    <tr> <td>Primary Outcome Measure(s)</td> <td>{{primary_measures}}  
</td> </tr>
 <tr> <td>Secondary Outcome Measure(s)</td> <td>{{secondary_measures}}</td></tr>
<tr> <td>Responsible Party</td> <td>{{responsible_party}} 
</td> </tr>
<tr> <td>Trial Last Updated</td> <td>{{last_update_posted_date}}</td> </tr>
  </tbody>
</table>  
<button type="button"><strong>Accepts Healthy Volunteers: {{eligibility_healthy_volunteers}}</strong></button>
`);



    const [mode, setMode] = useState<Mode>('HasuraStudy');
    const defaultNctId = 'NCT00102700';
    const defaultSearchHash = 'tqxCyI9M';
    let [nctOrSearchHash, setNctOrSearchHash] = useState(defaultNctId);

    const dispatch = useDispatch();

    const schemaType = getClassForMode(mode);
    // const [query, variables] = getModeData(mode, nctOrSearchHash, fragment, fragmentName);
    const studyData = useSelector((state: RootState) => state.study.studyPageHasura);
    const [fragmentName, fragment] = useHasuraFragment(schemaType, template);

    useEffect(() => {
        //console.log("INTROSPECTION Query", introspectionQuery)
        const QUERY = introspectionQuery
        dispatch(fetchHasuraIntrospection(QUERY));
    }, [dispatch]);

    useEffect(() => {
        const QUERY = `${getHasuraStudyQuery(fragmentName, fragment)}`
        dispatch(fetchStudyPageHasura(nctOrSearchHash ?? "", QUERY));
        const STUDY_QUERY = `${getHasuraStudyQuery(fragmentName, fragment)}`
        const SEARCH_QUERY = `${getSearchQuery(fragmentName, fragment)}`
        dispatch(mode == "Study" ? fetchStudyPageHasura(nctOrSearchHash ?? "", STUDY_QUERY) : fetchStudyPage(nctOrSearchHash ?? "", SEARCH_QUERY));
    }, [dispatch, nctOrSearchHash]);

    const introspection = useSelector((state: RootState) => state.introspection.hasuraIntrospection);


    const updateMode = mode => {
        setMode(mode);
        if (mode === 'Study') setNctOrSearchHash(defaultNctId);
        if (mode === 'Search') setNctOrSearchHash(defaultSearchHash);
    };

    const islands = {
        ...commonIslands,
        groot: (attributes: Record<string, string>) => {
            return (
                <img src="https://media.giphy.com/media/11vDNL1PrUUo0/source.gif" />
            );
        },
    };


    if (!introspection || !studyData) {
        return <BeatLoader />;
    }

    const sampleData = studyData?.data.ctgov_prod_studies[0] || studyData.data?.search?.studies?.[0];

    if (introspection) {
        const types = introspection.data.__schema.types;
        return (
            <div>
                <DropdownButton
                    bsStyle="default"
                    title={`Type: ${mode}`}
                    key={mode}
                    style={{ marginBottom: '10px' }}>
                    <MenuItem onClick={_ => updateMode('Study')}>Study</MenuItem>
                    <MenuItem onClick={_ => updateMode('Search')}>Search</MenuItem>
                </DropdownButton>
                <FormControl
                    placeholder="Select an nctid"
                    value={nctOrSearchHash}
                    onChange={e => setNctOrSearchHash(e.target.value || defaultNctId)}
                />
                <MailMerge
                    schema={{ kind: 'graphql', typeName: schemaType, types }}
                    sample={sampleData}
                    template={template}
                    onTemplateChanged={setTemplate}
                    islands={islands}
                />
                <pre>{fragment}</pre>
                <pre>
                    {JSON.stringify(studyData?.data.study || studyData.data?.search?.studies, null, 2)}
                </pre>
            </div>
        );
    }
    return <div>?</div>;
}
