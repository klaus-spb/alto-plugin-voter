<?php
/* ---------------------------------------------------------------------------
 * @Project: Alto CMS
 * @Plugin Name: Voter
 * @Author: Klaus
 * @License: GNU GPL v2 & MIT
 *----------------------------------------------------------------------------
 */

class PluginVoter_HookVoter extends Hook {

    /*
     * Регистрация событий на хуки
     */
    public function RegisterHook() {
		$this->AddHook('template_layout_body_end', 'AddVoterquestiondiv', __CLASS__);
		$this->AddHook('init_action', 'LoadLang', __CLASS__, PHP_INT_MAX);
	}

	public function LoadLang(){
		/**
		 * Загружаем в шаблон JS текстовки
		 */
		$this->Lang_AddLangJs(array(
			'plugin.voter.nobody_vote',
			'plugin.voter.vote_plus',
			'plugin.voter.vote_minus',
			'plugin.voter.topic_rating',
			'plugin.voter.user_rating',
			'plugin.voter.blog_rating',
			'plugin.voter.comment_rating',
			'topic_question_abstain_result'
			)
		);
	}

	public function AddVoterquestiondiv(){
		return $this->Viewer_Fetch(Plugin::GetTemplatePath(__CLASS__).'tpls/inject.votediv.tpl');
	}
	
}