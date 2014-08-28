<?php
/* ---------------------------------------------------------------------------
 * @Project: Alto CMS
 * @Plugin Name: VoterQuestion
 * @Author: Klaus
 * @License: GNU GPL v2 & MIT
 *----------------------------------------------------------------------------
 */
 
class PluginVoter_ModuleTopic_MapperTopic extends PluginVoter_Inherits_ModuleTopic_MapperTopic {


	public function GetUserVotesQuestion($FromWhere, $id) {
		
		$sql="SELECT 	u.user_id, 
						u.user_login
				FROM 	?_topic_question_vote  t ,
						?_user   u 

				WHERE t.topic_id = ?d
				and t.user_voter_id = u.user_id
				and t.answer = ?d
				ORDER BY user_login";	
	 
			$aVotes=array();
			if ($aRows=$this->oDb->select($sql, $FromWhere, $id)) {			
				foreach ($aRows as $aVote) {
					$aVotes[]=array(
						'uid' => $aVote['user_id'], 
						'login' => $aVote['user_login'],
					);				
				}
			}

			return $aVotes;
		}
}

?>