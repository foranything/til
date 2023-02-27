from deepl import deepl

t = deepl.DeepLCLI("en", "ja")
result = t.translate("hello") #=> "こんにちわ"
print(result)