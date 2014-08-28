<?php
/* ---------------------------------------------------------------------------
 * @Project: Alto CMS
 * @Plugin Name: Voter
 * @Author: Klaus
 * @License: GNU GPL v2 & MIT
 *----------------------------------------------------------------------------
 */
 
class PluginVoter_ActionAjax extends PluginVoter_Inherits_ActionAjax {	
	
	
	public function Init() {
		parent::Init();
		$this->oUserCurrent=$this->User_GetUserCurrent();
	}
	
	protected function RegisterEvent() {	
		parent::RegisterEvent();
		$this->AddEventPreg('/^vote$/i','/^whovote$/','EventWhoVote');
		$this->AddEventPreg('/^vote$/i','/^whovotequestion$/','EventWhoVoteQuestion');
	}
	 

	protected function EventWhoVote() {
		if(!$this->oUserCurrent){
			$this->Message_AddErrorSingle($this->Lang_Get('need_authorization'),$this->Lang_Get('error'));
			return;
		}
		if(!Config::Get('plugin.voter.show_votes')) {
			$this->Message_AddErrorSingle($this->Lang_Get('system_error'),$this->Lang_Get('error'));
			return;
		}
		$this->Viewer_SetResponseAjax('json');
		$id=0;
		$what='';
		if (func_check(getRequest('id',null,'post'),'id',1,11))$id=getRequest('id',null,'post');
		if (func_check(getRequest('what',null,'post'),'text',2,10))$what=getRequest('what',null,'post');
		
		if(!in_array($what, array('comment','topic','user','blog'))){
			$this->Message_AddErrorSingle($this->Lang_Get('system_error'),$this->Lang_Get('error'));
			return;
		}
		
		if($what=='topic'){ 
			if (!($oTarget=$this->Topic_GetTopicById($id))) {
				$this->Message_AddErrorSingle($this->Lang_Get('system_error'),$this->Lang_Get('error'));
				return;
			} 	
			$this->Viewer_AssignAjax('abstain',$oTarget->getCountVoteAbstain());			
		}
		if($what=='comment'){ 
			if (!($oTarget=$this->Comment_GetCommentById($id))) {
				$this->Message_AddErrorSingle($this->Lang_Get('system_error'),$this->Lang_Get('error'));
				return;
			} 	
		}		
		if($what=='blog'){ 
			if (!($oTarget=$this->Blog_GetBlogById($id))) {
				$this->Message_AddErrorSingle($this->Lang_Get('system_error'),$this->Lang_Get('error'));
				return;
			} 	
		}		
		if($what=='user'){ 
			if (!($oTarget=$this->User_GetUserById($id))) {
				$this->Message_AddErrorSingle($this->Lang_Get('system_error'),$this->Lang_Get('error'));
				return;
			}
					
		}
		
		$votes=array(); 
		
		$rating=$oTarget->getRating();
		$voters=$oTarget->getCountVote();

		$aVotes=$this->PluginVoter_Vote_GetUserVotes($what,$id);
		 
		
		$this->Viewer_AssignAjax('rating',$rating); 
		$this->Viewer_AssignAjax('voters',$voters);
		$this->Viewer_AssignAjax('votes',$aVotes);
		
	}
	
	protected function EventWhoVoteQuestion() {
		if(!$this->oUserCurrent){
			$this->Message_AddErrorSingle($this->Lang_Get('need_authorization'),$this->Lang_Get('error'));
			return;
		}
		if(!Config::Get('plugin.voter.show_question_votes')) {
			$this->Message_AddErrorSingle($this->Lang_Get('system_error'),$this->Lang_Get('error'));
			return;
		}
		$this->Viewer_SetResponseAjax('json');
		$id=0;
		$num=0;
		if (func_check(getRequest('id',null,'post'),'id',1,11))$id=getRequest('id',null,'post');
		if (func_check(getRequest('num',null,'post'),'id',1,3))$num=getRequest('num',null,'post');
		
		if (!($oTopic=$this->Topic_GetTopicById($id))) {
			$this->Message_AddErrorSingle($this->Lang_Get('system_error'),$this->Lang_Get('error'));
			return;
		}		
		
		$aVotes=$this->PluginVoterquestion_Topic_GetUserVotesQuestion($id,$num);
		$this->Viewer_AssignAjax('count_votes',count($aVotes));
		$this->Viewer_AssignAjax('votes',$aVotes);
		
		$strange_array = array();
		$strange_array = $this->Lang_Get('plugin');
		
		$this->Viewer_AssignAjax('vote_for_this',$strange_array['voter']['vote_for_this'] );
		
	}
	

}

?>