import React, { useEffect, useState } from 'react';
import { FormControl } from 'react-bootstrap';
import styled from 'styled-components';
import { BeatLoader } from 'react-spinners';
import MailMerge from './MailMerge';
import { GraphqlSchemaType } from './SchemaSelector';
import { IslandConstructor } from './MailMergeView';
import { useFragment } from './MailMergeFragment';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSampleStudy, fetchSampleStudyHasura } from 'services/study/actions';
import { getHasuraSampleStudyQuery, getSampleStudyQuery } from '../../components/MailMerge/MailMergeUtils';
import { RootState } from 'reducers';
import { fetchHasuraIntrospection, fetchIntrospection } from 'services/introspection/actions';
//import { IntrospectionQuery, getIntrospectionQuery } from 'graphql';
import { introspectionQuery } from 'graphql/utilities';
import { useHasuraFragment } from './HasuraMMFragment';

const StyledFormControl = styled(FormControl)`
    margin-bottom: 20px;
`;
const Container = styled.div`
    max-width: 1200px;
    margin-bottom: 20px;
`;

interface HasuraMailMergeFormControlProps {
    template: string;
    onTemplateChanged: (t: string) => void;
    islands?: Record<string, IslandConstructor>;
}

const default_nctid = 'NCT00102700';

export default function HasuraMailMergeFormControl(props: HasuraMailMergeFormControlProps) {
    const [nctId, setNctId] = useState(default_nctid);
    const dispatch = useDispatch();

    const [fragmentName, fragment] = useHasuraFragment('ctgov_studies', props.template);

    useEffect(() => {
        const QUERY = introspectionQuery  //`${gql(getIntrospectionQuery({ descriptions: false }))}`
        dispatch(fetchHasuraIntrospection(QUERY));
    }, [dispatch]);

    const introspection = useSelector((state: RootState) => state.introspection.hasuraIntrospection);

    useEffect(() => {
        const QUERY = `${getHasuraSampleStudyQuery(fragmentName, fragment)}`

        dispatch(fetchSampleStudyHasura(nctId ?? "", QUERY));
    }, [dispatch, fragment]);

    const study = useSelector((state: RootState) => state.study.hasuraSampleStudy);
    console.log('HI from HMMAILMERGE')
    if (!study || !introspection) {
        return <BeatLoader />;
    }

    const schema: GraphqlSchemaType = {
        kind: 'graphql',
        typeName: 'ctgov_studies',
        types: introspection.data.__schema.types,
    };

    return (
        <Container>
            <StyledFormControl
                placeholder={default_nctid}
                value={nctId}
                onChange={e => setNctId(e.target.value || default_nctid)}
            />
            <MailMerge
                schema={schema}
                sample={study?.data?.ctgov_studies[0] || {}}
                template={props.template}
                onTemplateChanged={props.onTemplateChanged}
                islands={props.islands}
            />
            {/* <CollapsiblePanel></CollapsiblePanel> */}
        </Container>
    );
}
