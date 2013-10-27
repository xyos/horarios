class SubjectsServices:

    def autocomplete(self,query):
        from Helpers import SIA
        sia = SIA()
        return sia.get_subjects(query,"")
