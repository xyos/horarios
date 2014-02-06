from haystack import indexes
from horarios.models import Subject


class SubjectIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.EdgeNgramField(document=True, model_attr='name')

    def get_model(self):
        return Subject