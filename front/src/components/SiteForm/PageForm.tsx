import * as React from 'react';
import { SiteFragment } from 'types/SiteFragment';
import { useQuery, useMutation } from 'react-apollo';
import { FormControl, Row, Col, Nav, Panel, NavItem } from 'react-bootstrap';
import styled from 'styled-components';
import { useState } from 'react';
import ThemedButton from 'components/StyledComponents/index';
import {
  PAGE_VIEW_QUERY,
  CREATE_PAGE_VIEW_MUTATION,
} from 'queries/PageViewQueries';
import {
  PageViewsQuery,
  PageViewsQuery_site_pageViews,
} from 'types/PageViewsQuery';

interface Props {
  page: PageViewsQuery_site_pageViews ;
}

export default function PageForm(props: Props) {
  const { page } = props;
  return <NavItem key={page.url + page.id}>{page.url}</NavItem>;
}
