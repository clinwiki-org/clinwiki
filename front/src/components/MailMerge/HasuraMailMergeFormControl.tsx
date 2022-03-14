import React, { useEffect, useState } from 'react';
import { FormControl } from 'react-bootstrap';
import styled from 'styled-components';
import { BeatLoader } from 'react-spinners';
import MailMerge from './MailMerge';
import { GraphqlSchemaType } from './SchemaSelector';
import { IslandConstructor } from './MailMergeView';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { fetchHasuraIntrospection, fetchHasuraIntrospectionDIS } from 'services/introspection/actions';

//import { IntrospectionQuery, getIntrospectionQuery } from 'graphql';
import { introspectionQuery } from 'graphql/utilities';
import { useFragment } from './MailMergeFragment';

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
    pageType:any;
}

const default_nctid = 'NCT00102700';

export default function HasuraMailMergeFormControl(props: HasuraMailMergeFormControlProps) {
    const [nctId, setNctId] = useState(default_nctid);
    const dispatch = useDispatch();

    const introspection = useSelector((state: RootState) => state.introspection.hasuraIntrospection);
    const QUERY = introspectionQuery  //`${gql(ge tIntrospectionQuery({ descriptions: false }))}`

    useEffect(() => {

        switch(props.pageType){
        case 'HasuraStudy':
            dispatch(fetchHasuraIntrospection(QUERY));
            return
        case 'HasuraCondition':
            dispatch(fetchHasuraIntrospectionDIS(QUERY));
            return
            default:
                return
        }

    }, [dispatch]);

    const study = useSelector((state: RootState) => state.study.hasuraSampleStudy);
    if (!study || !introspection) {
        return <BeatLoader />;
    }

    switch(props.pageType){
        case 'HasuraStudy':
            const schema: GraphqlSchemaType = {
                kind: 'graphql',
                typeName: 'ctgov_prod_studies',
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
                        sample={study?.data?.ctgov_prod_studies[0] || {}}
                        template={props.template}
                        onTemplateChanged={props.onTemplateChanged}
                        islands={props.islands}
                    />
                    {/* <CollapsiblePanel></CollapsiblePanel> */}
                </Container>
            );
        case 'HasuraCondition':
            const schema2: GraphqlSchemaType = {
                kind: 'graphql',
                typeName: 'disyii2_prod_20210704_2_tbl_conditions',
                types: introspection?.data?.__schema?.types,
            };
        
            return (
                <Container>
                    <StyledFormControl
                        placeholder={default_nctid}
                        value={nctId}
                        onChange={e => setNctId(e.target.value || default_nctid)}
                    />
                    <MailMerge
                        schema={schema2}
                        sample={study?.data?.disyii2_prod_20210704_2_tbl_conditions[0] || {}}
                        template={props.template}
                        onTemplateChanged={props.onTemplateChanged}
                        islands={props.islands}
                    />
                    {/* <CollapsiblePanel></CollapsiblePanel> */}
                </Container>
            );            
        default:
            return <>
                {"No Page Type"}
                </>
        }

}
