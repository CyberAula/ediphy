import styled from 'styled-components';
import { EDModal } from "../../../sass/general/EDModal";
import { BLUE_PRIMARY } from "../../../plugins/EnrichedPlayer/Styles";

export const ConfigContainer = styled(EDModal).attrs({ className: 'pluginConfig' })`
	.form-control {
		border-radius: 0;
 		box-shadow: none;
		-webkit-box-shadow: none;
		&:focus{
			border-color: ${BLUE_PRIMARY};
		}
		margin-bottom: 5px;
	}
`;
