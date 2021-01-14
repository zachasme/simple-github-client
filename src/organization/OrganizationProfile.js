import { html } from "htm/preact";
import { gql } from "@urql/preact";

import RepositoryList from "../repository/RepositoryList.js";

function OrganizationProfile({ organization }) {
  return html`<${RepositoryList} repositoryOwner=${organization} />`;
}

OrganizationProfile.fragments = {
  organization: gql`
    fragment OrganizationProfile_organization on Organization {
      ...RepositoryList_repositoryOwner
    }
    ${RepositoryList.fragments.repositoryOwner}
  `,
};

export default OrganizationProfile;
